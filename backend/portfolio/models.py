from django.db import models


class Profile(models.Model):
    full_name = models.CharField(max_length=120)
    role = models.CharField(max_length=120, help_text="Ex: Desenvolvedor Full Stack")
    bio = models.TextField()
    years_experience = models.PositiveSmallIntegerField(default=0)
    projects_delivered = models.PositiveSmallIntegerField(default=0)
    recurring_clients = models.PositiveSmallIntegerField(default=0)
    available_for_work = models.BooleanField(default=True)
    email = models.EmailField()
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    avatar = models.ImageField(upload_to="profile/", blank=True, null=True)

    class Meta:
        verbose_name = "Perfil"
        verbose_name_plural = "Perfil"

    def __str__(self):
        return self.full_name


class Skill(models.Model):
    name = models.CharField(max_length=60, unique=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]
        verbose_name = "Habilidade"
        verbose_name_plural = "Habilidades"

    def __str__(self):
        return self.name


class Technology(models.Model):
    name = models.CharField(max_length=60, unique=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Tecnologia"
        verbose_name_plural = "Tecnologias"

    def __str__(self):
        return self.name


class Project(models.Model):
    class Tag(models.TextChoices):
        FEATURED = "featured", "Em destaque"
        SAAS = "saas", "SaaS"
        ECOMMERCE = "ecommerce", "E-commerce"
        OTHER = "other", "Outro"

    title = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    tag = models.CharField(max_length=20, choices=Tag.choices, default=Tag.OTHER)
    description = models.TextField()
    technologies = models.ManyToManyField(Technology, related_name="projects", blank=True)
    image = models.ImageField(upload_to="projects/", blank=True, null=True)
    project_url = models.URLField(blank=True)
    repo_url = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-created_at"]
        verbose_name = "Projeto"
        verbose_name_plural = "Projetos"

    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Mensagem de contato"
        verbose_name_plural = "Mensagens de contato"

    def __str__(self):
        return f"{self.name} <{self.email}>"
