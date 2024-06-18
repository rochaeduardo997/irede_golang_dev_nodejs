/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       required:
 *         - number
 *         - description
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         director:
 *           type: string
 *         durationInSeconds:
 *           type: number
 * 
 *     GetMovie:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         director:
 *           type: string
 *         durationInSeconds:
 *           type: number
 *         durationInHours:
 *           type: string
 * 
 *     GetMovies:
 *       type: object
 *       properties:
 *         total:
 *           type: number
 *         page:
 *           type: number
 *         registers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/GetMovie'
 */