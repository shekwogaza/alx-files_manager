// Import the 'redis' library and 'promisify' utility from 'util'
const redis = require('redis');
const { promisify } = require('util');

// RedisClient class to handle Redis connections and operations
class RedisClient {
  constructor() {
    // Create a Redis client
    this.client = redis.createClient();
    
    // Convert 'get' method of the Redis client into a promise-based function
    this.getAsync = promisify(this.client.get).bind(this.client);
    
    // Handle connection errors by logging the error message
    this.client.on('error', (error) => {
      console.log(`Redis client not connected to the server: ${error.message}`);
    });
  }

  // Check if the Redis client is connected to the server
  isAlive() {
    return this.client.connected;
  }

  // Retrieve the value of a given key from Redis (asynchronously)
  async get(key) {
    return this.getAsync(key);
  }

  // Set a value in Redis with an expiration time (in seconds)
  async set(key, value, duration) {
    this.client.setex(key, duration, value);
  }

  // Delete a key from Redis
  async del(key) {
    this.client.del(key);
  }
}

// Create an instance of the RedisClient and export it for use in other modules
const redisClient = new RedisClient();
export default redisClient;
