import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as NextAuthReactModule from 'next-auth/react';
import * as nextCloudinary from 'next-cloudinary';
import type { CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import * as updateProfileApi from '../../_api/updateProfile';
import { UploadPhotoModal } from '../UploadPhotoModal';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('next-cloudinary', () => ({
  CldUploadButton: ({
    children,
    onSuccess,
  }: {
    children: React.ReactNode;
    onSuccess?: (result: { info?: CloudinaryUploadWidgetInfo | string }) => void;
  }) => (
    <button
      data-testid="cld-upload-modal-button"
      onClick={() => {
        if (onSuccess) {
          onSuccess({
            info: {
              secure_url: 'https://example.com/modal-avatar.jpg',
            } as CloudinaryUploadWidgetInfo,
          });
        }
      }}
    >
      {children}
    </button>
  ),
}));

jest.mock('../../_api/updateProfile', () => ({
  updateProfileImage: jest.fn(),
}));

describe('UploadPhotoModal', () => {
  const mockUpdateSession = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (NextAuthReactModule.useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          image: null,
        },
      },
      status: 'authenticated',
      update: mockUpdateSession,
    });
  });

  it('does not render dialog content when isOpen is false', () => {
    render(<UploadPhotoModal isOpen={false} onClose={mockOnClose} />);

    expect(screen.queryByText('Upload Profile Photo')).not.toBeInTheDocument();
  });

  it('renders modal content and initials fallback when user has no image', () => {
    render(<UploadPhotoModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByRole('heading', { name: /Upload Profile Photo/i })).toBeInTheDocument();
    expect(screen.getByText('JD')).toBeInTheDocument();
    expect(screen.getByText('Upload Photo')).toBeInTheDocument();
  });

  it('renders fallback HB initials when user name is undefined', () => {
    (NextAuthReactModule.useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: undefined,
          email: undefined,
          image: null,
        },
      },
      status: 'authenticated',
      update: mockUpdateSession,
    });

    render(<UploadPhotoModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('HB')).toBeInTheDocument();
  });

  it('renders profile image when user has an image in session', () => {
    (NextAuthReactModule.useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          image: 'https://example.com/current-avatar.jpg',
        },
      },
      status: 'authenticated',
      update: mockUpdateSession,
    });

    render(<UploadPhotoModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByAltText('Jane Doe profile photo')).toBeInTheDocument();
    expect(screen.getByText('Change Photo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Remove/i })).toBeInTheDocument();
  });

  it('renders fallback image alt when user has image but no name', () => {
    (NextAuthReactModule.useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: undefined,
          email: undefined,
          image: 'https://example.com/no-name-avatar.jpg',
        },
      },
      status: 'authenticated',
      update: mockUpdateSession,
    });

    render(<UploadPhotoModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByAltText('User profile photo')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    render(<UploadPhotoModal isOpen={true} onClose={mockOnClose} />);

    const closeBtn = screen.getByTestId('close-upload-photo-modal');
    await userEvent.click(closeBtn);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles uploading a photo and updates session', async () => {
    (updateProfileApi.updateProfileImage as jest.Mock).mockResolvedValue({
      isSuccess: true,
      data: {
        id: 'user-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        image: 'https://example.com/modal-avatar.jpg',
      },
    });

    render(<UploadPhotoModal isOpen={true} onClose={mockOnClose} />);

    const uploadBtn = screen.getByTestId('cld-upload-modal-button');
    await userEvent.click(uploadBtn);

    await waitFor(() => {
      expect(updateProfileApi.updateProfileImage).toHaveBeenCalledWith(
        'https://example.com/modal-avatar.jpg',
      );
      expect(mockUpdateSession).toHaveBeenCalledWith({
        image: 'https://example.com/modal-avatar.jpg',
      });
      expect(screen.getByTestId('modal-success-message')).toHaveTextContent(
        'Profile photo updated successfully!',
      );
    });
  });

  it('handles upload callback with public_id', async () => {
    const mockedNextCloudinary = jest.requireMock('next-cloudinary') as typeof nextCloudinary;
    jest.spyOn(mockedNextCloudinary, 'CldUploadButton').mockImplementationOnce(((props: {
      children?: React.ReactNode;
      onSuccess?: (result: { info?: CloudinaryUploadWidgetInfo }) => void;
    }) => (
      <button
        data-testid="cld-upload-public-id-btn"
        onClick={() => {
          if (props.onSuccess) {
            props.onSuccess({
              info: {
                public_id: 'cloudinary-pub-id',
              } as CloudinaryUploadWidgetInfo,
            });
          }
        }}
      >
        {props.children}
      </button>
    )) as unknown as typeof nextCloudinary.CldUploadButton);

    (updateProfileApi.updateProfileImage as jest.Mock).mockResolvedValue({
      isSuccess: true,
      data: {
        id: 'user-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        image: 'cloudinary-pub-id',
      },
    });

    render(<UploadPhotoModal isOpen={true} onClose={mockOnClose} />);

    const uploadBtn = screen.getByTestId('cld-upload-public-id-btn');
    await userEvent.click(uploadBtn);

    await waitFor(() => {
      expect(updateProfileApi.updateProfileImage).toHaveBeenCalledWith('cloudinary-pub-id');
    });
  });

  it('does not call updateProfileImage if result.info has no url', async () => {
    const mockedNextCloudinary = jest.requireMock('next-cloudinary') as typeof nextCloudinary;
    jest.spyOn(mockedNextCloudinary, 'CldUploadButton').mockImplementationOnce(((props: {
      children?: React.ReactNode;
      onSuccess?: (result: { info?: string }) => void;
    }) => (
      <button
        data-testid="cld-upload-empty-btn"
        onClick={() => {
          if (props.onSuccess) {
            props.onSuccess({ info: undefined });
          }
        }}
      >
        {props.children}
      </button>
    )) as unknown as typeof nextCloudinary.CldUploadButton);

    render(<UploadPhotoModal isOpen={true} onClose={mockOnClose} />);

    const uploadBtn = screen.getByTestId('cld-upload-empty-btn');
    await userEvent.click(uploadBtn);

    expect(updateProfileApi.updateProfileImage).not.toHaveBeenCalled();
  });

  it('handles removing photo and updates session', async () => {
    (NextAuthReactModule.useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          image: 'https://example.com/current-avatar.jpg',
        },
      },
      status: 'authenticated',
      update: mockUpdateSession,
    });

    (updateProfileApi.updateProfileImage as jest.Mock).mockResolvedValue({
      isSuccess: true,
      data: {
        id: 'user-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        image: null,
      },
    });

    render(<UploadPhotoModal isOpen={true} onClose={mockOnClose} />);

    const removeBtn = screen.getByRole('button', { name: /Remove/i });
    await userEvent.click(removeBtn);

    await waitFor(() => {
      expect(updateProfileApi.updateProfileImage).toHaveBeenCalledWith(null);
      expect(mockUpdateSession).toHaveBeenCalledWith({ image: null });
      expect(screen.getByTestId('modal-success-message')).toHaveTextContent(
        'Profile photo removed.',
      );
    });
  });

  it('displays error message when updateProfileImage fails', async () => {
    (updateProfileApi.updateProfileImage as jest.Mock).mockResolvedValue({
      isSuccess: false,
      error: 'Failed to upload photo',
    });

    render(<UploadPhotoModal isOpen={true} onClose={mockOnClose} />);

    const uploadBtn = screen.getByTestId('cld-upload-modal-button');
    await userEvent.click(uploadBtn);

    await waitFor(() => {
      expect(screen.getByTestId('modal-error-message')).toHaveTextContent('Failed to upload photo');
      expect(mockUpdateSession).not.toHaveBeenCalled();
    });
  });
});
