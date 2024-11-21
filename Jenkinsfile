pipeline {
    agent any 
    // Use any available Jenkins agent to run the pipeline
    
    stages { 
        // Define the pipeline stages

        stage('Build') { 
            // First stage: Build the Docker image
            steps {
                sh 'docker compose build' 
                // Run the `docker compose build` command to build all services defined in the docker-compose.yml
            }
        }

        stage('Run Tests') { 
            // Second stage: Run tests
            steps {
                sh 'docker compose run app npm test' 
                // Start the `app` service in an isolated container and run the test suite (npm test)
                // Replace `app` with the actual service name from docker-compose.yml if it's different
            }
        }

        stage('Deploy') { 
            // Third stage: Deploy the application
            steps {
                sh 'docker compose up -d' 
                // Start all services in detached mode (-d), ensuring the app runs in the background
            }
        }
    }
}
