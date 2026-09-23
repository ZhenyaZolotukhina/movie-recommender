// Initialize the application when the window loads
window.onload = async function() {
    try {
        // Display loading message
        const resultElement = document.getElementById('result');
        resultElement.textContent = "Loading movie data...";
        resultElement.className = 'loading';
        
        // Load data
        await loadData();
        
        // Populate dropdown and update status
        populateMoviesDropdown();
        resultElement.textContent = "Data loaded. Please select a movie.";
        resultElement.className = 'success';
    } catch (error) {
        console.error('Initialization error:', error);
        // Error message already set in data.js
    }
};

// Populate the movies dropdown with sorted movie titles
function populateMoviesDropdown() {
    const selectIds = ['movie-select', 'profile-movie-1', 'profile-movie-2', 'profile-movie-3'];
    // Sort movies alphabetically by title
    const sortedMovies = [...movies].sort((a, b) => a.title.localeCompare(b.title));
    
    selectIds.forEach(selectId => {
        const selectElement = document.getElementById(selectId);
        
        // Clear existing options except the first placeholder
        while (selectElement.options.length > 1) {
            selectElement.remove(1);
        }
        
        // Add movies to dropdown
        sortedMovies.forEach(movie => {
            const option = document.createElement('option');
            option.value = movie.id;
            option.textContent = movie.title;
            selectElement.appendChild(option);
        });
    });
}

// Calculate cosine similarity between two equal-length vectors
function cosineSimilarity(vectorA, vectorB) {
    if (vectorA.length !== vectorB.length) {
        throw new Error('Cannot compare vectors with different lengths.');
    }
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let index = 0; index < vectorA.length; index++) {
        dotProduct += vectorA[index] * vectorB[index];
        normA += vectorA[index] * vectorA[index];
        normB += vectorB[index] * vectorB[index];
    }
    
    if (normA === 0 || normB === 0) {
        return 0;
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Rank all unwatched movies against a genre vector and return the top five
function rankMovies(queryVector, excludedMovieIds) {
    return movies
        .filter(movie => !excludedMovieIds.has(movie.id))
        .map(movie => ({
            ...movie,
            score: cosineSimilarity(queryVector, movie.genreVector)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
}

// Main recommendation function
function getRecommendations() {
    const resultElement = document.getElementById('result');
    
    try {
        // Step 1: Get user input
        const selectElement = document.getElementById('movie-select');
        const selectedMovieId = parseInt(selectElement.value);
        
        if (isNaN(selectedMovieId)) {
            resultElement.textContent = "Please select a movie first.";
            resultElement.className = 'error';
            return;
        }
        
        // Step 2: Find the liked movie
        const likedMovie = movies.find(movie => movie.id === selectedMovieId);
        if (!likedMovie) {
            resultElement.textContent = "Error: Selected movie not found in database.";
            resultElement.className = 'error';
            return;
        }
        
        // Show loading message while processing
        resultElement.textContent = "Calculating recommendations...";
        resultElement.className = 'loading';
        
        // Use setTimeout to allow the UI to update before heavy computation
        setTimeout(() => {
            try {
                // Calculate cosine similarity and select the top five recommendations
                const topRecommendations = rankMovies(
                    likedMovie.genreVector,
                    new Set([likedMovie.id])
                );
                
                // Display results
                if (topRecommendations.length > 0) {
                    const recommendationTitles = topRecommendations.map(movie => movie.title);
                    resultElement.textContent = `Because you liked "${likedMovie.title}", we recommend: ${recommendationTitles.join(', ')}`;
                    resultElement.className = 'success';
                } else {
                    resultElement.textContent = `No recommendations found for "${likedMovie.title}".`;
                    resultElement.className = 'error';
                }
            } catch (error) {
                console.error('Error in recommendation calculation:', error);
                resultElement.textContent = "An error occurred while calculating recommendations.";
                resultElement.className = 'error';
            }
        }, 100);
    } catch (error) {
        console.error('Error in getRecommendations:', error);
        resultElement.textContent = "An unexpected error occurred.";
        resultElement.className = 'error';
    }
}

// Build a profile from three watched movies and recommend similar movies
function getProfileRecommendations() {
    const resultElement = document.getElementById('result');
    
    try {
        const selectedMovieIds = [
            document.getElementById('profile-movie-1').value,
            document.getElementById('profile-movie-2').value,
            document.getElementById('profile-movie-3').value
        ].map(value => parseInt(value));
        
        if (selectedMovieIds.some(movieId => isNaN(movieId))) {
            resultElement.textContent = "Please select all three profile movies.";
            resultElement.className = 'error';
            return;
        }
        
        const watchedMovieIds = new Set(selectedMovieIds);
        if (watchedMovieIds.size !== 3) {
            resultElement.textContent = "Please select three distinct movies.";
            resultElement.className = 'error';
            return;
        }
        
        const watchedMovies = selectedMovieIds.map(movieId =>
            movies.find(movie => movie.id === movieId)
        );
        if (watchedMovies.some(movie => !movie)) {
            resultElement.textContent = "Error: A selected movie was not found in the database.";
            resultElement.className = 'error';
            return;
        }
        
        resultElement.textContent = "Calculating profile recommendations...";
        resultElement.className = 'loading';
        
        // Use setTimeout to allow the UI to update before heavy computation
        setTimeout(() => {
            try {
                const profileVector = watchedMovies[0].genreVector.map((_, index) =>
                    watchedMovies.reduce(
                        (sum, movie) => sum + movie.genreVector[index],
                        0
                    ) / 3
                );
                const topRecommendations = rankMovies(profileVector, watchedMovieIds);
                
                if (topRecommendations.length > 0) {
                    const recommendationTitles = topRecommendations.map(movie => movie.title);
                    resultElement.textContent = `Based on your watched movies, we recommend: ${recommendationTitles.join(', ')}`;
                    resultElement.className = 'success';
                } else {
                    resultElement.textContent = "No profile recommendations found.";
                    resultElement.className = 'error';
                }
            } catch (error) {
                console.error('Error in profile recommendation calculation:', error);
                resultElement.textContent = "An error occurred while calculating profile recommendations.";
                resultElement.className = 'error';
            }
        }, 100);
    } catch (error) {
        console.error('Error in getProfileRecommendations:', error);
        resultElement.textContent = "An unexpected error occurred.";
        resultElement.className = 'error';
    }
}
