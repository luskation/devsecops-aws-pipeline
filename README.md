# 🔐 DevSecOps Pipeline — OWASP Juice Shop on AWS

> Projeto de aprendizado prático em DevSecOps, integrando ferramentas de segurança em um pipeline CI/CD completo com deploy na AWS ECS.

---

## 🎯 Objetivo

Este projeto foi desenvolvido com o propósito de aprender na prática as principais ferramentas e práticas de **DevSecOps**, utilizando o [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) como aplicação-alvo — uma aplicação deliberadamente vulnerável, ideal para testes de segurança. O foco foi integrar segurança em todas as etapas do ciclo de desenvolvimento, além de aprofundar conhecimentos em **AWS**.

---

## 🏗️ Arquitetura do Pipeline

```
Push/PR → main
    │
    ├─► 1. Secret Scanning     (Gitleaks)
    ├─► 2. Lint                (ESLint)
    ├─► 3. SAST                (Semgrep)
    ├─► 4. Code Quality        (SonarCloud)
    ├─► 5. IaC Security        (Checkov)
    ├─► 6. Build + Container Scan + Push ECR  (Trivy + Cosign)
    ├─► 7. SBOM                (Syft / Anchore)
    ├─► 8. Deploy              (AWS ECS)
    └─► 9. DAST                (OWASP ZAP)
```

---

## 🛠️ Ferramentas e o que Aprendi

### 🔑 Gitleaks — Secret Scanning
Detecta segredos expostos no repositório (API keys, tokens, senhas) antes que cheguem à produção.

- **O que aprendi:** Como segredos acidentalmente comitados representam um dos vetores de ataque mais comuns; como usar `.gitleaks.toml` para configurar regras e exceções.
- **Resultado no projeto:** Identificou uma `AWS_SECRET_ACCESS_KEY` fake usada em testes (`src/app.py`), demonstrando o funcionamento da ferramenta.

---

### 🔍 ESLint — Análise Estática de Código (Linting)
Analisa o código JavaScript em busca de erros, más práticas e problemas de estilo que podem impactar segurança.

- **O que aprendi:** Configuração de regras de segurança como `eqeqeq` (previne comparações inseguras), `no-var` e `prefer-const`; como o linting é a primeira linha de defesa na qualidade de código.

---

### 🛡️ Semgrep — SAST (Static Application Security Testing)
Realiza análise estática profunda buscando padrões de vulnerabilidade no código-fonte.

- **O que aprendi:** A diferença entre linting e SAST; como o Semgrep usa regras baseadas em padrões AST (Abstract Syntax Tree) para encontrar vulnerabilidades como SQLi, XSS, path traversal etc.; uso do modo `--config auto`.

---

### ☁️ SonarCloud — Qualidade e Segurança de Código
Plataforma de análise contínua que combina qualidade de código com detecção de vulnerabilidades (OWASP Top 10).

- **O que aprendi:** Como configurar `sonar-project.properties`; métricas de código (coverage, code smells, duplications); integração com GitHub para feedback em Pull Requests.

---

### 🏛️ Checkov — IaC Security (Infrastructure as Code)
Verifica arquivos de infraestrutura (Terraform, Dockerfile, docker-compose, GitHub Actions) em busca de configurações inseguras.

- **O que aprendi:** Conceito de "shift-left" aplicado à infraestrutura; como misconfigurações em IaC são responsáveis por grande parte dos incidentes em nuvem; verificação de permissões excessivas, portas abertas e ausência de criptografia.

---

### 🐳 Trivy — Container Image Scanning
Escaneia a imagem Docker em busca de vulnerabilidades em pacotes do sistema operacional e dependências de aplicação (CVEs).

- **O que aprendi:** Como imagens base desatualizadas introduzem centenas de CVEs; a importância de usar imagens minimalistas (distroless, alpine); como priorizar vulnerabilidades por severidade (CRITICAL, HIGH).

---

### ✍️ Cosign — Assinatura de Imagens (Supply Chain Security)
Assina criptograficamente a imagem Docker após o push, garantindo integridade e autenticidade.

- **O que aprendi:** Conceito de supply chain security e ataques como SolarWinds; como o Cosign implementa assinatura baseada em Sigstore; uso de chaves privadas em secrets do GitHub Actions.

---

### 📦 Syft — SBOM (Software Bill of Materials)
Gera um inventário completo de todos os componentes e dependências da imagem Docker no formato CycloneDX.

- **O que aprendi:** O que é SBOM e por que está se tornando requisito regulatório (Executive Order 14028 nos EUA); como um SBOM permite rastrear componentes vulneráveis rapidamente após a divulgação de novos CVEs.

---

### 🕷️ OWASP ZAP — DAST (Dynamic Application Security Testing)
Realiza testes de segurança dinâmicos contra a aplicação em execução, simulando ataques reais.

- **O que aprendi:** A diferença fundamental entre SAST (analisa código) e DAST (testa a aplicação rodando); como o ZAP detecta vulnerabilidades do OWASP Top 10 em runtime (XSS, SQLi, CSRF etc.); configuração de regras customizadas via `.zap/rules.tsv`.

---

## ☁️ AWS — Serviços Utilizados

| Serviço | Uso no Projeto |
|---------|---------------|
| **ECR** (Elastic Container Registry) | Registry privado para armazenar as imagens Docker |
| **ECS** (Elastic Container Service) | Orquestração e execução dos containers em produção |
| **IAM** | Gerenciamento de credenciais e permissões para o pipeline |

**O que aprendi sobre AWS:**
- Autenticação no ECR via `aws-actions/configure-aws-credentials` e `amazon-ecr-login`
- Deploy automatizado via `aws ecs update-service --force-new-deployment`
- Boas práticas com IAM: uso de secrets no GitHub Actions em vez de hardcoded credentials
- Estrutura de naming de imagens ECR: `<account-id>.dkr.ecr.<region>.amazonaws.com/<repo>:<tag>`

---

## 📊 Relatórios Gerados

O pipeline gera e arquiva os seguintes relatórios como artifacts:

| Relatório | Ferramenta | Formato |
|-----------|-----------|---------|
| `semgrep-report` | Semgrep | SARIF |
| `checkov-report` | Checkov | SARIF |
| `trivy-report` | Trivy | SARIF |
| `sbom` | Syft | CycloneDX JSON |
| `zap-report` | OWASP ZAP | HTML |

---

## 🔧 Configuração

### Secrets necessários no GitHub

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_ACCOUNT_ID
SONAR_CLOUD_TOKEN
COSIGN_PRIVATE_KEY
COSIGN_PASSWORD
```

### Pré-requisitos

- Conta AWS com ECR e ECS configurados
- Organização no SonarCloud
- Chave Cosign gerada via `cosign generate-key-pair`

---

## 📚 Referências

- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Gitleaks](https://github.com/gitleaks/gitleaks)
- [Semgrep](https://semgrep.dev/)
- [SonarCloud](https://sonarcloud.io/)
- [Checkov](https://www.checkov.io/)
- [Trivy](https://trivy.dev/)
- [Cosign / Sigstore](https://sigstore.dev/)
- [Syft](https://github.com/anchore/syft)
- [OWASP ZAP](https://www.zaproxy.org/)

---

> **Autor:** Lucas Rodrigues  
> **Objetivo:** Aprendizado em DevSecOps, segurança de aplicações e AWS
