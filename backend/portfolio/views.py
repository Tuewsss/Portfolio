from rest_framework import mixins, viewsets

from .models import ContactMessage, Profile, Project, Skill
from .serializers import (
    ContactMessageSerializer,
    ProfileSerializer,
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
    serializer_class = ProjectSerializer
    lookup_field = "slug"


class ContactMessageViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
