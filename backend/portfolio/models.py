from django.db import models


class Profile(models.Model):
    full_name = models.CharField(max_length=120)
    role = models.CharField(max_length=120, help_text="Ex: Desenvolvedor Full Stack")
    tagline = models.CharField(max_length=300, blank=True, help_text="Linha curta abaixo da saudação, no hero.")
    bio = models.TextField(help_text="Texto usado na seção 'Sobre mim' (pode ter múltiplos parágrafos).")
    years_experience = models.PositiveSmallIntegerField(default=0)
    projects_delivered = models.PositiveSmallIntegerField(default=0)
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


class ProjectMedia(models.Model):
    project = models.ForeignKey(Project, related_name="media", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="projects/gallery/", help_text="Aceita imagens estáticas e GIFs.")
    caption = models.CharField(max_length=150, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Mídia do projeto"
        verbose_name_plural = "Mídias do projeto"

    def __str__(self):
        return self.caption or f"Mídia #{self.pk or '?'} de {self.project.title}"


class Experience(models.Model):
    CATEGORY_WORK = "work"
    CATEGORY_EDUCATION = "education"
    CATEGORY_CHOICES = [
        (CATEGORY_WORK, "Profissional"),
        (CATEGORY_EDUCATION, "Acadêmica"),
    ]

    company = models.CharField(max_length=120, help_text="Empresa (profissional) ou instituição de ensino (acadêmica).")
    role = models.CharField(max_length=120, blank=True, help_text="Ex: Desenvolvedor Estagiário, ou o nome do curso.")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default=CATEGORY_WORK)
    logo = models.ImageField(upload_to="experience/", blank=True, null=True)
    description = models.TextField()
    technologies = models.ManyToManyField(Technology, related_name="experiences", blank=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True, help_text="Deixe em branco se ainda estiver em andamento.")
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "-start_date"]
        verbose_name = "Experiência"
        verbose_name_plural = "Experiências"

    def __str__(self):
        return f"{self.role} — {self.company}" if self.role else self.company


class CalendarEntry(models.Model):
    date = models.DateField(unique=True)
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]
        verbose_name = "Atividade do calendário"
        verbose_name_plural = "Atividades do calendário"

    def __str__(self):
        return f"{self.date:%d/%m/%Y} — {self.title}"


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
