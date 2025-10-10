# Contributing to E-Commerce Dashboard

Thank you for your interest in contributing to our e-commerce platform! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### 1. Fork the Repository
- Fork the project on GitHub
- Clone your fork locally
- Add the original repository as upstream

```bash
git clone https://github.com/yourusername/ecommerce-dashboard.git
cd ecommerce-dashboard
git remote add upstream https://github.com/originalowner/ecommerce-dashboard.git
```

### 2. Create a Branch
Create a new branch for your feature or bug fix:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Make Changes
- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation if needed

### 4. Test Your Changes
```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Build the project
npm run build

# Test locally
npm run dev
```

### 5. Commit Your Changes
Use conventional commit messages:

```bash
git commit -m "feat: add user profile management"
git commit -m "fix: resolve cart calculation issue"
git commit -m "docs: update API documentation"
```

### 6. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 📝 Commit Message Convention

We use conventional commits for clear and consistent commit messages:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## 🎯 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint rules
- Use Prettier for code formatting
- Write meaningful variable and function names
- Add JSDoc comments for complex functions

### Component Guidelines
- Use functional components with hooks
- Implement proper error boundaries
- Make components reusable when possible
- Follow the existing folder structure

### Database Changes
- Use Drizzle ORM for database operations
- Create migrations for schema changes
- Test database changes thoroughly
- Document any breaking changes

### Internationalization
- Add translations for both Arabic and English
- Test RTL layout for Arabic content
- Use the existing i18n structure

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to reproduce the bug
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: Browser, OS, Node.js version
6. **Screenshots**: If applicable

## 💡 Feature Requests

For feature requests, please provide:

1. **Problem**: What problem does this solve?
2. **Solution**: Proposed solution
3. **Alternatives**: Alternative solutions considered
4. **Additional Context**: Any additional information

## 🔍 Code Review Process

1. All submissions require review
2. Reviewers will check for:
   - Code quality and style
   - Functionality and testing
   - Documentation updates
   - Breaking changes
3. Address review feedback promptly
4. Maintain a clean commit history

## 📚 Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Git

### Local Development
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Set up database
npm run db:generate
npm run db:push

# Start development server
npm run dev
```

### Testing
- Test your changes on different screen sizes
- Test both Arabic and English interfaces
- Verify authentication flows
- Test admin and user roles

## 🚀 Deployment

- The main branch is automatically deployed to production
- Feature branches can be deployed to preview environments
- Ensure all tests pass before merging

## 📞 Getting Help

- Check existing issues and discussions
- Join our community discussions
- Ask questions in pull request comments
- Contact maintainers for complex issues

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributors page

Thank you for contributing to make this project better! 🎉