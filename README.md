# Content-Based Movie Recommender

A Week 2 recommender systems assignment based on the MovieLens 100K dataset.

The project extends a starter content-based movie recommender by replacing Jaccard genre matching with cosine similarity and adding profile-based recommendations from multiple watched movies.

## Features

- Item-to-item movie recommendations
- Cosine similarity over 19-dimensional MovieLens genre vectors
- Top-5 recommendations
- Profile-based recommendations from 3 selected movies
- User profile vector created by averaging the three movie genre vectors
- Exclusion of already selected/watched movies from recommendation results
- Validation requiring three distinct movies for profile recommendations
- Vanilla HTML, CSS, and JavaScript only

## Recommendation Logic

### Item-to-Item

A selected movie is represented as a binary genre vector.

The recommender compares this vector with every other movie using cosine similarity:

\[
\text{cosine}(A,B)=
\frac{A \cdot B}
{\|A\|\|B\|}
\]

Candidates are sorted by similarity score and the Top-5 movies are returned.

### Profile-Based

The user selects three watched movies.

Their genre vectors are averaged element by element to create one profile vector:

\[
P_i =
\frac{M_{1i}+M_{2i}+M_{3i}}{3}
\]

The profile vector is then compared with the remaining movies using the same cosine-similarity ranking process.

## Dataset

The project uses the MovieLens 100K dataset files:

- `u.item` — movie metadata and genre indicators
- `u.data` — user ratings

The recommendation score itself is based on movie genre vectors. Rating data is not used to change the recommendation ranking.

The MovieLens genre representation contains 19 positions:

`unknown`, `Action`, `Adventure`, `Animation`, `Children's`, `Comedy`, `Crime`, `Documentary`, `Drama`, `Fantasy`, `Film-Noir`, `Horror`, `Musical`, `Mystery`, `Romance`, `Sci-Fi`, `Thriller`, `War`, `Western`.

## Project Structure

```text
.
├── index.html
├── style.css
├── data.js
├── script.js
├── u.item
└── u.data
```

- `index.html` — application interface
- `style.css` — page styling
- `data.js` — MovieLens data loading and parsing
- `script.js` — UI behavior, cosine similarity, ranking, and profile logic

## Running Locally

Because the application loads the dataset using `fetch()`, it should be served through a local HTTP server rather than opened directly with `file://`.

For example:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Technologies

- HTML
- CSS
- JavaScript
- MovieLens 100K

## Assignment

Week 2 — Content-Based Movie Recommender

The implementation focuses on:

- replacing naive/Jaccard matching with cosine similarity;
- building an aggregated profile from multiple watched movies;
- producing Top-5 recommendations;
- comparing item-to-item and profile-based recommendation behavior.

## Live Demo

https://zhenyazolotukhina.github.io/movie-recommender/ 
