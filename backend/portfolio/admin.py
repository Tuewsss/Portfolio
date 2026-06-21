from django.contrib import admin

from .models import (
    CalendarEntry,
    ContactMessage,
    Experience,
    GitHubStats,
    Profile,
    Project,
    ProjectMedia,
    Skill,
    SpotifyAuth,
    Technology,
)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ["full_name", "role", "available_for_work"]


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ["name", "order"]
    ordering = ["order"]


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ["name"]
    search_fields = ["name"]


class ProjectMediaInline(admin.TabularInline):
    model = ProjectMedia
    extra = 1
    fields = ["image", "caption", "order"]


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["title", "tag", "is_featured", "order", "created_at"]
    list_filter = ["tag", "is_featured"]
    search_fields = ["title", "description"]
    prepopulated_fields = {"slug": ("title",)}
    autocomplete_fields = ["technologies"]
    inlines = [ProjectMediaInline]
    fieldsets = (
        (None, {"fields": ("title", "slug", "is_featured", "tag")}),
        ("Conteúdo", {"fields": ("description", "technologies")}),
        ("Capa", {"fields": ("image",)}),
        ("Links", {"fields": ("project_url", "repo_url")}),
        ("Organização", {"fields": ("order",)}),
    )


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ["company", "role", "start_date", "end_date", "order"]
    list_filter = ["company"]
    search_fields = ["company", "role", "description"]
    autocomplete_fields = ["technologies"]
    ordering = ["order", "-start_date"]


@admin.register(CalendarEntry)
class CalendarEntryAdmin(admin.ModelAdmin):
    list_display = ["date", "title"]
    list_filter = ["date"]
    search_fields = ["title", "description"]
    date_hierarchy = "date"
    ordering = ["-date"]


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "created_at", "is_read"]
    list_filter = ["is_read"]
    readonly_fields = ["name", "email", "message", "created_at"]


@admin.register(SpotifyAuth)
class SpotifyAuthAdmin(admin.ModelAdmin):
    list_display = ["updated_at"]

    def has_add_permission(self, request):
        return False


@admin.register(GitHubStats)
class GitHubStatsAdmin(admin.ModelAdmin):
    list_display = ["total_commits", "total_repos", "total_stars", "estimated_lines", "updated_at"]
    readonly_fields = ["total_commits", "total_repos", "total_stars", "estimated_lines", "languages", "updated_at"]

    def has_add_permission(self, request):
        return False
