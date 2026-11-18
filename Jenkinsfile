pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 10, unit: 'MINUTES')
    }

    environment {
        JAVA_HOME = '/Library/Java/JavaVirtualMachines/temurin-23.jdk/Contents/Home'
        PATH+QA_TOOLS = '/Library/Java/JavaVirtualMachines/temurin-23.jdk/Contents/Home/bin:/opt/homebrew/bin:/Users/macbook/.nodejs/bin'
    }

    stages {
        stage('Start test services') {
            steps {
                sh '''
                    set -eu

                    python3 -m venv jenkins-serenity-tests/.backend-venv
                    jenkins-serenity-tests/.backend-venv/bin/pip install \
                        --disable-pip-version-check --upgrade pip
                    jenkins-serenity-tests/.backend-venv/bin/pip install \
                        --disable-pip-version-check \
                        -r backend_app/requirements.txt

                    (
                        cd backend_app
                        JENKINS_NODE_COOKIE=dontKillMe nohup \
                            ../jenkins-serenity-tests/.backend-venv/bin/uvicorn \
                            app:app --host 127.0.0.1 --port 8000 \
                            > ../jenkins-serenity-tests/backend.log 2>&1 < /dev/null &
                        echo $! > ../jenkins-serenity-tests/.backend.pid
                    )

                    (
                        cd web_dashboard
                        npm ci
                        JENKINS_NODE_COOKIE=dontKillMe nohup \
                            ./node_modules/.bin/next dev \
                            --hostname 127.0.0.1 --port 3000 \
                            > ../jenkins-serenity-tests/dashboard.log 2>&1 < /dev/null &
                        echo $! > ../jenkins-serenity-tests/.dashboard.pid
                    )

                    curl --fail --silent --show-error --retry 30 \
                        --retry-connrefused --retry-delay 2 http://127.0.0.1:8000/
                    curl --fail --silent --show-error --retry 30 \
                        --retry-connrefused --retry-delay 2 http://127.0.0.1:3000/
                '''
            }
        }

        stage('Run Gherkin smoke tests') {
            steps {
                dir('jenkins-serenity-tests') {
                    sh 'mvn -B clean verify'
                }
            }
        }
    }

    post {
        always {
            sh '''
                for pid_file in \
                    jenkins-serenity-tests/.backend.pid \
                    jenkins-serenity-tests/.dashboard.pid; do
                    if [ -f "$pid_file" ]; then
                        kill "$(cat "$pid_file")" || true
                        rm -f "$pid_file"
                    fi
                done
            '''
            junit allowEmptyResults: true,
                testResults: 'jenkins-serenity-tests/target/failsafe-reports/TEST-*.xml'
            archiveArtifacts allowEmptyArchive: true,
                artifacts: 'jenkins-serenity-tests/target/site/serenity/**'
        }
    }
}
