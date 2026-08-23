import { POST } from '../route';
import { v2 as cloudinary } from 'cloudinary';

jest.mock('cloudinary', () => ({
  v2: {
    utils: {
      api_sign_request: jest.fn(),
    },
  },
}));

describe('/api/sign-cloudinary-params', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.CLOUDINARY_API_SECRET = 'mock-api-secret';
  });

  afterEach(() => {
    delete process.env.CLOUDINARY_API_SECRET;
  });

  it('signs parameters and returns signature', async () => {
    const paramsToSign = { timestamp: '1234567890', folder: 'happybank' };
    const mockSignature = 'mock-cloudinary-signature';
    (cloudinary.utils.api_sign_request as jest.Mock).mockReturnValue(mockSignature);

    const mockRequest = {
      json: async () => ({ paramsToSign }),
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ signature: mockSignature });
    expect(cloudinary.utils.api_sign_request).toHaveBeenCalledWith(paramsToSign, 'mock-api-secret');
  });
});
