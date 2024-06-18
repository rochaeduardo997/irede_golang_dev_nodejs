/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       required:
 *         - number
 *         - description
 *       properties:
 *         id:
 *           type: string
 *         number:
 *           type: number
 *         description:
 *           type: string
 *         roomMoviesId:
 *           type: array
 *           items:
 *             type: string
 * 
 *     GetRoom:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         number:
 *           type: number
 *         description:
 *           type: string
 *         roomMovies:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               director:
 *                 type: string
 *               durationInSeconds:
 *                 type: number
 *               durationInHours:
 *                 type: string
 * 
 *     GetRooms:
 *       type: object
 *       properties:
 *         total:
 *           type: number
 *         page:
 *           type: number
 *         registers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/GetRoom'
 */