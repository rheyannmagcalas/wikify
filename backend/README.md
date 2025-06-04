# Wikify Cleanup Recommender API

A simple FastAPI-based backend that serves personalized Wikipedia article cleanup recommendations based on user-selected categories.

## Description

This API reads a preprocessed dataset containing Wikipedia article URLs, cleanup messages, categories, and topic relevance scores. It uses user-selected interests to recommend relevant Wikipedia pages that need cleanup, helping contributors focus their efforts efficiently.

## Features

- Accepts user interests via query parameters
- Returns top recommended articles with cleanup messages and relevance scores
- Uses topic modeling (LDA) to categorize articles by broad topics
- Easy to run and develop with included Makefile

---

## Setup and Usage

### Prerequisites

- Python 3.8+
- `make` command (Linux/Mac) or use Windows alternatives like WSL or GNU Make for Windows

### Installation

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd <repo-folder>

   ```

2. Build and activate the virtual environment, install dependencies, and run the app using the provided Makefile:

   ```
   make all
   ```

This will:

- Create a Python virtual environment in .venv/

- Install required packages from requirements.txt

- Start the FastAPI server with hot reload on port 8000

### Running the Server

To start the FastAPI server with auto-reload enabled:

    ````
    make run
    ```

This launches the app at:
http://127.0.0.1:8000

## API Usage

### Endpoint: /recommendations

Get Wikipedia article cleanup recommendations based on your interests.

#### Request:

GET /recommendations?categories=Science,Art

Parameters:

- categories (required): Comma-separated list of interest categories. Example: Science,Art

#### Response:

Returns JSON with top 30 article recommendations sorted by relevance score.

```
{
  "recommendations": [
    {
      "pageid": 1,
      "title": "Example Article Title",
      "relatedCategories": ["Science", "Technology"],
      "cleanup_messages": ["Cleanup message 1", "Additional note"],
      "relevance": 87.45
    },
    ...
  ]
}
 "cleanup_messages": ["Cleanup message 1", "Additional note"],
      "relevance": 87.45
    },
    ...
  ]
}
```

## Project Structure

```
.
├── app/
│   └── main.py          # FastAPI app with recommendation endpoint
├── categories.csv       # Preprocessed dataset with cleanup messages & categories
├── requirements.txt     # Python dependencies
├── Makefile             # Automation for environment setup and running server
└── README.md            # This documentation file
```

## How It Works

1. The API loads the preprocessed CSV containing Wikipedia article URLs, cleanup messages, and category-topic distributions.
2. It parses the category percentages and calculates a relevance score based on user-selected categories.
3. Returns a list of top articles with titles extracted from URLs and associated cleanup notes.

## Development & Testing

1. Modify or update categories.csv with your own dataset.
2. Extend the LDA topic modeling or cleanup message extraction in preprocessing.
3. Use FastAPI's interactive docs at http://127.0.0.1:8000/docs to test API endpoints.

## Future Improvements

- Add authentication and user progress tracking
- Support filtering by multiple interests with weights
- Provide article editing links directly from recommendations
- Optimize performance with caching and async processing
