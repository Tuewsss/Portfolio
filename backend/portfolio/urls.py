from rest_framework.routers import DefaultRouter

from .views import ContactMessageViewSet, ProfileViewSet, ProjectViewSet, SkillViewSet

router = DefaultRouter()
router.register("profile", ProfileViewSet, basename="profile")
router.register("skills", SkillViewSet, basename="skill")
router.register("projects", ProjectViewSet, basename="project")
router.register("contact", ContactMessageViewSet, basename="contact")

urlpatterns = router.urls
