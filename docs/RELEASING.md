# Releasing and Deployment

This document contains the maintainer workflow for versioning, releasing, and deploying LexiconMeum frontend.

## Deployment overview

Production deployment is currently handled by GitHub Actions on pushes to `master`.

Workflow file:

- `.github/workflows/deploy.yml`

## Branching model

The current release flow is:

- feature and integration work on `develop`
- release preparation on `release/<version>`
- production deploys from `master`

## Versioning

Project version is defined in `package.json`.

## Release checklist

### 1. Sync `develop`

```bash
git checkout develop
git pull origin develop
```

### 2. Create the release branch

```bash
git checkout -b release/<version>
git push origin release/<version>
```

### 3. Open the release PR

Open a pull request from:

```
release/<version> -> master
```

Recommended PR content:

- summary of changes
- testing status
- deployment notes
- known issues, if any

### 4. Merge and tag the release

After the PR is merged:

```bash
git checkout master
git pull origin master
git tag -a v<version> -m "Release <version>"
git push origin v<version>
```

### 5. Bump `develop` to the next version

```bash
git checkout develop
git pull origin develop
```

Manually update the version in `package.json`, then:

```bash
git commit -am "Bump to <version>-SNAPSHOT"
git push origin develop
```
