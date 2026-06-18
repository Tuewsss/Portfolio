import requests
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from portfolio import github_stats


class Command(BaseCommand):
    help = "Busca estatísticas públicas do GitHub (commits, repos, linguagens) e atualiza o cache local."

    def handle(self, *args, **options):
        username = settings.GITHUB_USERNAME
        if not username:
            raise CommandError("Defina GITHUB_USERNAME no .env antes de rodar este comando.")

        self.stdout.write(f"Buscando estatísticas de {username}...")
        try:
            stats = github_stats.refresh_stats()
        except requests.exceptions.HTTPError as exc:
            status = exc.response.status_code if exc.response is not None else None
            if status == 404:
                raise CommandError(
                    f"Usuário '{username}' não encontrado no GitHub (404). "
                    "Confira o valor de GITHUB_USERNAME no .env."
                ) from exc
            if status == 403:
                raise CommandError(
                    "GitHub retornou 403 (limite de requisições ou token inválido). "
                    "Confira GITHUB_TOKEN no .env."
                ) from exc
            raise CommandError(f"Erro ao consultar a API do GitHub: {exc}") from exc
        except requests.exceptions.RequestException as exc:
            raise CommandError(f"Falha de conexão com a API do GitHub: {exc}") from exc

        self.stdout.write(
            self.style.SUCCESS(
                f"OK: {stats.total_commits} commits, {stats.total_repos} repos, {stats.total_stars} stars, "
                f"~{stats.estimated_lines} linhas estimadas, {len(stats.languages)} linguagens."
            )
        )
