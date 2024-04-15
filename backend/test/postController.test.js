const { toggleLikePost } = require('../controllers/LikesController');
const Post = require('../models/PostModel');
const Likes = require('../models/LikesModel');

jest.mock('../models/CommentairesModel', () => {
    return {
    };
  });
jest.mock('../models/ReponseModel', () => {
    return {
    };
  });
jest.mock('../models/LikeRepModel', () => {
    return {
    };
  });
jest.mock('../models/LikeComModel', () => {
    return {
    };
  });
jest.mock('../models/NotificationModel', () => {
    return {
      create: jest.fn(),
    };
  });
jest.mock('../models/PostModel', () => {
    return {
      findByPk: jest.fn(),
    };
  });
jest.mock('../models/LikesModel', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn(),
}));

describe('toggleLikePost', () => {
  beforeEach(() => {
    Post.findByPk.mockClear();
    Likes.findOne.mockClear();
    Likes.create.mockClear();
    Likes.destroy.mockClear();
  });

  test('should add a like to a post if not already liked', async () => {
    Post.findByPk.mockResolvedValue({
        id_post: '152',
        increment: jest.fn() 
      });
      Likes.create.mockResolvedValue({
        id_like: 'some-id', 
        date_like: new Date(), 
      });

    const req = {
      params: { postId: '152' },
      userId: '27',
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await toggleLikePost(req, res);

    expect(Likes.create).toHaveBeenCalledWith({
        id_post: '152',
        id_utilisateur: '27',
        date_like: expect.any(Date), 
      });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
