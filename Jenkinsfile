pipeline {
    agent any

    tools {nodejs "Node810"}

    environment {
        BLOG_LINK_ADMIN_KEY = credentials('BLOG_LINK_ADMIN_KEY')
    }


    options {
        buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '10'))
    }

    stages {
        stage('Checkout') {
            steps {
                slackSend color: 'good', channel: "#ci-build", message: "pluto-blog-subscriber Build Started: ${env.BRANCH_NAME}"
                checkout scm
                sh 'git status'
            }
        }

        stage('clean artifacts'){
            steps {
                script {
                    sh 'rm -rf output'
                    sh 'rm -rf node_modules'
                    sh 'npm cache clean -f'
                }
            }
        }

        stage('Install dependencies'){
            steps {
                script {
                    try {
                        sh 'npm --version'
                        sh 'npm ci'
                    } catch (err) {
                        slackSend color: "danger", channel: "#ci-build", failOnError: true, message: "Build Failed at NPM INSTALL: ${env.BRANCH_NAME}"
                        throw err
                    }
                }
            }
        }

        // stage('Unit Test'){
        //     steps {
        //         script {
        //             try {
        //                 sh 'npm test'
        //             } catch (err) {
        //                 slackSend color: "danger", channel: "#ci-build", failOnError: true, message: "Build Failed at Unit Test step: ${env.BRANCH_NAME}"
        //                 throw err
        //             }
        //         }
        //     }
        // }

        stage('Deploy') {
            steps {
                script {
                    try {
                        sh 'npm run deploy'
                    } catch (err) {
                        slackSend color: "danger", failOnError: true, message: "Build Failed at BUILD & DEPLOY: ${env.BRANCH_NAME}"
                        throw err
                    }
                }
            }
        }

        stage('Notify') {
            steps {
                script {
                    def targetUrl;
                    slackSend color: 'good', channel: "#ci-build", message: "pluto-blog-subscriber Build DONE!"
                }
            }
        }
    }

    post {
        always {
            deleteDir()
        }
    }
}