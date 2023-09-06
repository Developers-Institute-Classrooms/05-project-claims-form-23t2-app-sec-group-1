# 05 Project - Claims Form and Approval System

## Getting Started

Requirements - node.js, docker, DB passwords

To spin up the app, use the command: `docker-compose up`

## Run Tests
API test in server folder:
- npm install
- npm test

React tests in client folder:
- npm install
- npm test

Example JSON for POSTING to [api/form](http://localhost:5001/api/form):

{		
	"policy_number": "12345678",
	"customer_id": "CUST001",
	"condition_claimed_for": "Backpain",
	"first_symptoms_date": "2022-01-01T00:00:00.000Z",
	"symptoms_details": "Experienced sharp pain while lifting heavy object",
	"medical_service_type": "Physical therapy",
	"service_provider_name": "ABC Medical Center",
	"other_insurance_provider": false,
	"consent": true
}

Example response JSON from API

{
	"claim_id": "3906815876",
	"status": "submitted",
	"policy_number": "12345678",
	"customer_id": "CUST001",
	"condition_claimed_for": "Backpain",
	"first_symptoms_date": "2022-01-01T00:00:00.000Z",
	"symptoms_details": "Experienced sharp pain while lifting heavy object",
	"medical_service_type": "Physical therapy",
	"service_provider_name": "ABC Medical Center",
	"other_insurance_provider": false,
	"consent": true,
	"created_at": "2023-05-14T10:24:49.907Z"
}

