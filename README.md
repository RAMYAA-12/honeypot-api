# Honeypot API

This project implements an API-based honeypot to capture and analyze malicious request behavior.

## Features
- API key authentication
- Honeypot endpoint that accepts all payloads
- Trap endpoint (/admin)
- Rate limiting
- Attack pattern detection
- IP risk scoring

## Endpoints
- GET /health
- POST /honeypot
- POST /admin
- GET /info

## Authentication
Send API key via header:
Authorization: Bearer <API_KEY>

## Note
No real data is stored or exposed. This is for security research and validation purposes only.
