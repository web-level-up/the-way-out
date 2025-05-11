const dummyMazes = [
    {
        id: 1,
        maze_layout: "1111000011110000", // 4x4 (16)
        difficulty_level_id: 1,
        starting_position: [0, 0],
        ending_position: [0, 2],
    },
    {
        id: 2,
        maze_layout: "10101010101010101010101010101010", // 4x4 (16)
        difficulty_level_id: 2,
        starting_position: [0, 0],
        ending_position: [0, 2],        
    },
    {
        id: 3,
        maze_layout: "1111111111111111111111111111111100000000000000000000000000000000", // 8x8 (64)
        difficulty_level_id: 3,
        starting_position: [0, 0],
        ending_position: [0, 2],
    },
    {
        id: 4,
        maze_layout: "1100110011001100110011001100110011001100110011001100110011001100", // 8x8 (64)
        difficulty_level_id: 1,
        starting_position: [0, 0],
        ending_position: [0, 2],
    },
    {
        id: 5,
        maze_layout: "1010101010101010101010101010101010101010101010101010101010101010", // 8x8 (64)
        difficulty_level_id: 2,
        starting_position: [0, 0],
        ending_position: [0, 2],
    },
    {
        id: 6,
        maze_layout: "11110000111100001111000011110000", // 4x4 (16)
        difficulty_level_id: 1,
        starting_position: [0, 0],
        ending_position: [0, 2],
    },
    {
        id: 7,
        maze_layout: "10101010101010101010101010101010", // 4x4 (16)
        difficulty_level_id: 2,
        starting_position: [0, 0],
        ending_position: [0, 2],
    },
    {
        id: 8,
        maze_layout: "1111111111111111000000000000000011111111111111110000000000000000",  // 8x8 (64)
        difficulty_level_id: 3,
        starting_position: [0, 0],
        ending_position: [0, 2],
    },
    {
        id: 9,
        maze_layout: "1100110011001100110011001100110011001100110011001100110011001100", // 8x8 (64)
        difficulty_level_id: 1,
        starting_position: [0, 0],
        ending_position: [0, 2],
    },
    {
        id: 10,
        maze_layout: "1010101010101010101010101010101010101010101010101010101010101010", // 8x8 (64)
        difficulty_level_id: 2,
        starting_position: [0, 0],
        ending_position: [0, 2],
    },
    {
        id: 11,
        maze_layout: "11110000111100001111000011110000", // 4x4 (16)
        difficulty_level_id: 1,
        starting_position: [0, 0],
        ending_position: [0, 2],
    },
    {
        id: 12,
        maze_layout: "10101010101010101010101010101010", // 4x4 (16)
        difficulty_level_id: 2,
        starting_position: [0, 0],
        ending_position: [0, 2],
    },
    {
        id: 13,
        maze_layout: "1111111111111111000000000000000011111111111111110000000000000000",  // 8x8 (64)
        difficulty_level_id: 3,
        starting_position: [0, 0],
        ending_position: [0, 2],
    },
    {
        id: 14,
        maze_layout: "1100110011001100110011001100110011001100110011001100110011001100", // 8x8 (64)
        difficulty_level_id: 1,
        starting_position: [0, 0],
        ending_position: [0, 2],
    },
    {
        id: 15,
        maze_layout: "1010101010101010101010101010101010101010101010101010101010101010", // 8x8 (64)
        difficulty_level_id: 2,
        starting_position: [0, 0],
        ending_position: [0, 2],
    },
    {
        id: 16,
        maze_layout: "11110000111100001111000011110000", // 4x4 (16)
        difficulty_level_id: 1,
        starting_position: [0, 0],
        ending_position: [0, 2],
    },
    {
        id: 17,
        maze_layout: "10101010101010101010101010101010", // 4x4 (16)
        difficulty_level_id: 2,
        starting_position: [0, 0],
        ending_position: [0, 2],
    },
    {
        id: 18,
        maze_layout: "1111111111111111000000000000000011111111111111110000000000000000",  // 8x8 (64)
        difficulty_level_id: 3,
        starting_position: [0, 0],
        ending_position: [0, 2],
    },
    {
        id: 19,
        maze_layout: "1100110011001100110011001100110011001100110011001100110011001100", // 8x8 (64)
        difficulty_level_id: 1,
        starting_position: [0, 0],
        ending_position: [0, 2],
    },
    {
        id: 20,
        maze_layout: "1010101010101010101010101010101010101010101010101010101010101010", // 8x8 (64)
        difficulty_level_id: 2,
        starting_position: [0, 0],
        ending_position: [0, 2],
    }
];

const difficultyLevels = [
    { id: 1, difficulty_level_name: "Easy" },
    { id: 2, difficulty_level_name: "Medium" },
    { id: 3, difficulty_level_name: "Hard" },
    { id: 4, difficulty_level_name: "Very Hard" },
    { id: 5, difficulty_level_name: "Insane" }
];

export { dummyMazes, difficultyLevels };