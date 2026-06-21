from django.http import HttpResponse, HttpResponseRedirect
from django.views.decorators.http import require_GET
from rest_framework import mixins, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from . import github_stats, spotify
from .models import CalendarEntry, ContactMessage, Experience, Profile, Project, Skill, SpotifyAuth
from .serializers import (
    CalendarEntrySerializer,
    ContactMessageSerializer,
    ExperienceSerializer,
    ProfileSerializer,
    ProjectDetailSerializer,
    ProjectSerializer,
    SkillSerializer,
)


class ProfileViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class SkillViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer


class ProjectViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Project.objects.prefetch_related("technologies").all()
    lookup_field = "slug"

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProjectDetailSerializer
        return ProjectSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == "retrieve":
            qs = qs.prefetch_related("media")
        return qs


class ContactMessageViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer


class ExperienceViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """Somente leitura: as experiências só podem ser criadas/editadas pelo admin."""

    queryset = Experience.objects.prefetch_related("technologies").all()
    serializer_class = ExperienceSerializer
    pagination_class = None


class CalendarEntryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """Somente leitura: as atividades só podem ser criadas/editadas pelo admin."""

    serializer_class = CalendarEntrySerializer
    pagination_class = None

    def get_queryset(self):
        qs = CalendarEntry.objects.all()
        year = self.request.query_params.get("year")
        month = self.request.query_params.get("month")
        if year:
            qs = qs.filter(date__year=year)
        if month:
            qs = qs.filter(date__month=month)
        return qs


@require_GET
def spotify_login(request):
    """Visite essa URL no navegador (logado no Spotify) para autorizar o app uma única vez."""
    return HttpResponseRedirect(spotify.build_authorize_url())


@require_GET
def spotify_callback(request):
    error = request.GET.get("error")
    code = request.GET.get("code")
    if error or not code:
        return HttpResponse(f"Autorização falhou: {error or 'código ausente'}", status=400)

    tokens = spotify.exchange_code_for_tokens(code)
    refresh_token = tokens.get("refresh_token")
    if not refresh_token:
        return HttpResponse("O Spotify não retornou um refresh_token.", status=400)

    auth, _ = SpotifyAuth.objects.get_or_create(pk=1)
    auth.refresh_token = refresh_token
    auth.save()
    return HttpResponse("Spotify conectado com sucesso! Pode fechar esta aba.")


@api_view(["GET"])
def now_playing(request):
    data = spotify.get_now_playing()
    return Response(data or {})


@api_view(["GET"])
def github_stats_view(request):
    stats = github_stats.get_or_refresh_stats()
    if not stats:
        return Response({})
    return Response(
        {
            "total_commits": stats.total_commits,
            "total_repos": stats.total_repos,
            "total_stars": stats.total_stars,
            "estimated_lines": stats.estimated_lines,
            "languages": stats.languages,
            "updated_at": stats.updated_at,
        }
    )
