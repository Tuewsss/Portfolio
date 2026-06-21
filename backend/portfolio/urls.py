from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    CalendarEntryViewSet,
    ContactMessageViewSet,
    ExperienceViewSet,
    ProfileViewSet,
    ProjectViewSet,
    SkillViewSet,
    github_stats_view,
    now_playing,
    spotify_callback,
    spotify_login,
)

router = DefaultRouter()
router.register("profile", ProfileViewSet, basename="profile")
router.register("skills", SkillViewSet, basename="skill")
router.register("projects", ProjectViewSet, basename="project")
router.register("contact", ContactMessageViewSet, basename="contact")
router.register("calendar", CalendarEntryViewSet, basename="calendar")
router.register("experiences", ExperienceViewSet, basename="experience")

urlpatterns = [
    path("spotify/login/", spotify_login, name="spotify-login"),
    path("spotify/callback/", spotify_callback, name="spotify-callback"),
    path("spotify/now-playing/", now_playing, name="spotify-now-playing"),
    path("github/stats/", github_stats_view, name="github-stats"),
] + router.urls
