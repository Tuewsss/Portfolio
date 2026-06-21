from rest_framework import serializers

from .models import CalendarEntry, ContactMessage, Experience, Profile, Project, ProjectMedia, Skill, Technology


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name", "order"]


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = ["id", "name"]


class ProjectMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMedia
        fields = ["id", "image", "caption", "order"]


class ProjectSerializer(serializers.ModelSerializer):
    technologies = TechnologySerializer(many=True, read_only=True)
    tag_display = serializers.CharField(source="get_tag_display", read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "slug",
            "tag",
            "tag_display",
            "description",
            "technologies",
            "image",
            "project_url",
            "repo_url",
            "is_featured",
            "order",
            "created_at",
        ]


class ProjectDetailSerializer(ProjectSerializer):
    media = ProjectMediaSerializer(many=True, read_only=True)

    class Meta(ProjectSerializer.Meta):
        fields = ProjectSerializer.Meta.fields + ["media"]


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            "id",
            "full_name",
            "role",
            "tagline",
            "bio",
            "years_experience",
            "projects_delivered",
            "available_for_work",
            "email",
            "linkedin_url",
            "github_url",
            "avatar",
        ]


class ExperienceSerializer(serializers.ModelSerializer):
    technologies = TechnologySerializer(many=True, read_only=True)

    class Meta:
        model = Experience
        fields = [
            "id",
            "company",
            "role",
            "logo",
            "description",
            "technologies",
            "start_date",
            "end_date",
            "order",
        ]


class CalendarEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEntry
        fields = ["id", "date", "title", "description"]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "message", "created_at"]
        read_only_fields = ["id", "created_at"]
