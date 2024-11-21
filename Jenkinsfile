pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'docker compose build'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'docker compose run app npm test'
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker compose up -d'
            }
        }
    }
}
