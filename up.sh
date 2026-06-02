#!/bin/bash

echo "=================================="
echo "Starting Hybrid Search Application"
echo "=================================="

echo "Starting Backend..."

cd backend

source venv/bin/activate

uvicorn main:app --reload &

cd ..

sleep 3

echo "Starting Frontend..."

cd frontend

npm run dev