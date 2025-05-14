pipeline {
    agent any

    tools {
        nodejs "NodeJS 18" // Name must match your global config
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/umar23-zan/Sharia-V1.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('Sharia-V1') {
                    bat 'npm ci'
                }
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                dir('Sharia-V1') {
                    bat 'npx playwright install --with-deps'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('Sharia-V1') {
                    bat 'npm test'
                }
            }
        }

        stage('Generate Report') {
            steps {
                dir('Sharia-V1') {
                    bat 'npx playwright show-report --output=playwright-report'
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'Sharia-V1/playwright-report/**/*', allowEmptyArchive: true
        }
    }
}
