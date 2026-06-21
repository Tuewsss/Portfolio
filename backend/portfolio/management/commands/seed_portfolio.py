from django.core.management.base import BaseCommand

from portfolio.models import Profile, Project, Skill, Technology

SKILLS = [
    "Python",
    "Django",
    "Django REST",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "PostgreSQL",
    "Docker",
    "Git",
    "Figma",
]

PROJECTS = [
    {
        "title": "Plataforma de gestão financeira",
        "slug": "plataforma-gestao-financeira",
        "tag": Project.Tag.FEATURED,
        "description": (
            "Dashboard completo com análise de fluxo de caixa em tempo real, relatórios "
            "automáticos e integração bancária. API em Django REST, front em Next."
        ),
        "technologies": ["Next.js", "Django REST", "PostgreSQL", "TypeScript"],
        "is_featured": True,
        "order": 0,
    },
    {
        "title": "App de agendamento",
        "slug": "app-de-agendamento",
        "tag": Project.Tag.SAAS,
        "description": "Sistema de reservas com calendário inteligente e notificações.",
        "technologies": ["React", "Tailwind CSS"],
        "is_featured": False,
        "order": 1,
    },
    {
        "title": "Loja headless",
        "slug": "loja-headless",
        "tag": Project.Tag.ECOMMERCE,
        "description": "Catálogo rápido com checkout otimizado e painel administrativo próprio.",
        "technologies": ["Next.js", "Stripe"],
        "is_featured": False,
        "order": 2,
    },
]


class Command(BaseCommand):
    help = "Popula o banco com Profile, Skills e Projects de exemplo (placeholder) para desenvolvimento."

    def handle(self, *args, **options):
        profile, created = Profile.objects.get_or_create(
            pk=1,
            defaults={
                "full_name": "Mateus Monteiro Mendes",
                "role": "Desenvolvedor Full Stack",
                "tagline": "Desenvolvedor full stack focado em desenvolvimento Web.",
                "bio": (
                    "Sou desenvolvedor e gosto de trabalhar onde o código encontra o design. "
                    "Acredito que produto bom é aquele que some — o usuário só sente que tudo "
                    "funciona.\n\nTrabalho em todo o ciclo: levanto requisitos, modelo a base de "
                    "dados, escrevo a API e entrego a interface. Sempre buscando o equilíbrio "
                    "entre simplicidade e robustez."
                ),
                "years_experience": 5,
                "projects_delivered": 30,
                "recurring_clients": 12,
                "available_for_work": True,
                "email": "seu@email.com",
                "linkedin_url": "https://linkedin.com/in/seu-usuario",
                "github_url": "https://github.com/Tuewsss",
            },
        )
        self.stdout.write(self.style.SUCCESS(f"Profile {'criado' if created else 'já existia'}: {profile.full_name}"))

        for order, name in enumerate(SKILLS):
            _, created = Skill.objects.get_or_create(name=name, defaults={"order": order})
            if created:
                self.stdout.write(f"  + Skill: {name}")

        for data in PROJECTS:
            tech_names = data.pop("technologies")
            project, created = Project.objects.get_or_create(slug=data["slug"], defaults=data)
            technologies = [Technology.objects.get_or_create(name=n)[0] for n in tech_names]
            project.technologies.set(technologies)
            self.stdout.write(f"  + Project: {project.title} ({'criado' if created else 'já existia'})")

        self.stdout.write(self.style.SUCCESS("Seed concluído."))
