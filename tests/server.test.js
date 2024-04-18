const request = require('supertest');
const app = require('../server'); // Importing the app object from your server file
const { permutationsWithRepetition } = require('../server'); // Adjust the path as needed


describe('Get random word test', () => {
    let randomWord;
    const wordLength = 5; // Example: requesting a word of length 5
  
    beforeAll(async () => {
      const response = await request(app)
        .get(`/random-word?wordLength=${wordLength}`)
        .expect(200); // Expecting a successful response (status code 200)
      
      randomWord = response.text;
    });
  
    it('randomWord should be a string', () => {
        expect(typeof randomWord).toBe('string');
    });
    
    it('randomWord should have a length of 5', () => {
        expect(randomWord.length).toBe(5);
    });
  });


  describe('permutationsWithRepetition', () => {
    it('returns all permutations with repetition for an array of length 1', () => {
      const arr = ['a'];
      const length = 3;
      const result = permutationsWithRepetition(arr, length);
      // Expecting ['aaa']
      expect(result).toEqual([['a', 'a', 'a']]);
    });
  
    it('returns all permutations with repetition for an array of length 2', () => {
      const arr = ['a', 'b'];
      const length = 2;
      const result = permutationsWithRepetition(arr, length);
      // Expecting ['aa', 'ab', 'ba', 'bb']
      expect(result).toEqual([
        ['a', 'a'],
        ['a', 'b'],
        ['b', 'a'],
        ['b', 'b']
      ]);
    });
  
    it('returns all permutations with repetition for an array of length 3', () => {
      const arr = ['a', 'b', 'c'];
      const length = 2;
      const result = permutationsWithRepetition(arr, length);
      // Expecting ['aa', 'ab', 'ac', 'ba', 'bb', 'bc', 'ca', 'cb', 'cc']
      expect(result).toEqual([
        ['a', 'a'],
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'a'],
        ['b', 'b'],
        ['b', 'c'],
        ['c', 'a'],
        ['c', 'b'],
        ['c', 'c']
      ]);
    });
  });