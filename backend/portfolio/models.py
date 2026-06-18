from django.db import models


class Profile(models.Model):
    full_name = models.CharField(max_length=120)
    role = models.CharField(max_length=120, help_text="Ex: Desenvolvedor Full Stack")
    headline = models.CharField(
        max_length=200, blank=True, help_text="Frase de impacto do hero. Ex: Construo interfaces limpas e funcionais."
    )
    tagline = models.CharField(
        max_length=300, blank=True, help_text="Linha curta abaixo do headline, no hero."
    )
    bio = models.TextField(help_text="Texto usado na seção 'Sobre mim' (pode ter múltiplos parágrafos).")
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


class SpotifyAuth(models.Model):
    refresh_token = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Autenticação do Spotify"
        verbose_name_plural = "Autenticação do Spotify"

    def __str__(self):
        return f"Spotify conectado em {self.updated_at:%d/%m/%Y %H:%M}"


class GitHubStats(models.Model):
    total_commits = models.PositiveIntegerField(default=0)
    total_repos = models.PositiveIntegerField(default=0)
    total_stars = models.PositiveIntegerField(default=0)
    estimated_lines = models.PositiveBigIntegerField(
        default=0, help_text="Estimativa a partir dos bytes por linguagem (GitHub não expõe linhas reais)."
    )
    languages = models.JSONField(default=dict, help_text='Ex: {"Python": 45.2, "TypeScript": 30.1}')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Estatísticas do GitHub"
        verbose_name_plural = "Estatísticas do GitHub"

    def __str__(self):
        return f"GitHub atualizado em {self.updated_at:%d/%m/%Y %H:%M}"


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
