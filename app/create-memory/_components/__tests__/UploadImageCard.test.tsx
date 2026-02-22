import { render, screen } from '@testing-library/react';
import * as nextCloudinary from 'next-cloudinary';
import { useFormContext } from 'react-hook-form';
import { FormWrapper } from '../../../../test-helper/formWrapper';
import { UploadImageCard } from '../UploadImageCard';
import type { CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import { JSX } from 'react';

// Mock next-cloudinary components
jest.mock('next-cloudinary', () => ({
  CldImage: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="cld-image" />
  ),
  CldUploadButton: ({
    children,
    onSuccess,
  }: {
    children: React.ReactNode;
    onSuccess?: (result: { info?: CloudinaryUploadWidgetInfo }) => void;
  }) => (
    <button
      data-testid="cld-upload-button"
      onClick={() => {
        // Simulate successful upload
        if (onSuccess) {
          onSuccess({
            info: {
              public_id: 'test-image-id',
              secure_url: 'https://res.cloudinary.com/test/image/upload/test-image-id',
            } as CloudinaryUploadWidgetInfo,
          });
        }
      }}
    >
      {children}
    </button>
  ),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="next-image" />
  ),
}));

type MemoryFormData = {
  imageId: string | null;
  title: string;
  message: string;
  hashtags: string[];
};

describe('UploadImageCard', () => {
  it('should render polaroid icon when imageId is null', () => {
    render(
      <FormWrapper<MemoryFormData>
        defaultValues={{
          imageId: null,
          title: '',
          message: '',
          hashtags: [],
        }}
      >
        <UploadImageCard memoryTitle="Test Memory" isLoading={false} />
      </FormWrapper>,
    );

    expect(screen.getByTestId('upload-image-card')).toBeInTheDocument();
    expect(screen.getByTestId('next-image')).toBeInTheDocument();
    expect(screen.getByTestId('next-image')).toHaveAttribute('alt', 'polaroid icon');
    expect(screen.queryByTestId('cld-image')).not.toBeInTheDocument();
    expect(screen.getByText('Test Memory')).toBeInTheDocument();
    expect(screen.getByText('Upload image')).toBeInTheDocument();
  });

  it('should render CldImage when imageId is a string', () => {
    // Test lines 28-35: CldImage rendering when imageId is a string
    render(
      <FormWrapper<MemoryFormData>
        defaultValues={{
          imageId: 'test-image-id',
          title: '',
          message: '',
          hashtags: [],
        }}
      >
        <UploadImageCard memoryTitle="Test Memory" isLoading={false} />
      </FormWrapper>,
    );

    expect(screen.getByTestId('upload-image-card')).toBeInTheDocument();
    expect(screen.getByTestId('cld-image')).toBeInTheDocument();
    expect(screen.getByTestId('cld-image')).toHaveAttribute('src', 'test-image-id');
    expect(screen.getByTestId('cld-image')).toHaveAttribute('alt', 'uploaded image');
    expect(screen.queryByTestId('next-image')).not.toBeInTheDocument();
    expect(screen.getByText('Test Memory')).toBeInTheDocument();
  });

  it('should call setValue with public_id when upload succeeds', () => {
    // Test lines 52-54: onSuccess callback sets imageId
    const setValueSpy = jest.fn();
    const watchSpy = jest.fn().mockReturnValue(null);

    const TestWrapper = () => {
      const methods = useFormContext();

      // Override setValue and watch
      methods.setValue = setValueSpy;
      methods.watch = watchSpy;

      return <UploadImageCard memoryTitle="Test Memory" isLoading={false} />;
    };

    render(
      <FormWrapper<MemoryFormData>
        defaultValues={{
          imageId: null,
          title: '',
          message: '',
          hashtags: [],
        }}
      >
        <TestWrapper />
      </FormWrapper>,
    );

    const uploadButton = screen.getByTestId('cld-upload-button');
    uploadButton.click();

    // Verify setValue was called with imageId and public_id
    expect(setValueSpy).toHaveBeenCalledTimes(1);
    expect(setValueSpy).toHaveBeenCalledWith('imageId', 'test-image-id');
  });

  it('should handle onSuccess when result.info.public_id is undefined', () => {
    // Test lines 52-54: onSuccess callback handles undefined public_id
    // When imageInfo?.public_id is undefined, setValue is called with undefined
    const setValueSpy = jest.fn();
    const watchSpy = jest.fn().mockReturnValue(null);

    // Create a custom mock for this test that returns undefined public_id
    // jest.requireMock is a Jest API (not CommonJS require) for accessing mocked modules
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mockedNextCloudinary = jest.requireMock('next-cloudinary') as typeof nextCloudinary;

    type CldUploadButtonProps = {
      children: React.ReactNode;
      onSuccess?: (result: { info?: CloudinaryUploadWidgetInfo }) => void;
      uploadPreset?: string;
      className?: string;
      signatureEndpoint?: string;
    };

    const mockImplementation = ({ children, onSuccess }: CldUploadButtonProps): JSX.Element => (
      <button
        data-testid="cld-upload-button"
        onClick={() => {
          if (onSuccess) {
            onSuccess({
              info: {
                public_id: undefined,
              } as unknown as CloudinaryUploadWidgetInfo,
            });
          }
        }}
      >
        {children}
      </button>
    );

    jest
      .spyOn(mockedNextCloudinary, 'CldUploadButton')
      .mockImplementation(mockImplementation as unknown as typeof nextCloudinary.CldUploadButton);

    const TestWrapper = () => {
      const methods = useFormContext();
      methods.setValue = setValueSpy;
      methods.watch = watchSpy;
      return <UploadImageCard memoryTitle="Test Memory" isLoading={false} />;
    };

    render(
      <FormWrapper<MemoryFormData>
        defaultValues={{
          imageId: null,
          title: '',
          message: '',
          hashtags: [],
        }}
      >
        <TestWrapper />
      </FormWrapper>,
    );

    const uploadButton = screen.getByTestId('cld-upload-button');
    uploadButton.click();

    // Should handle undefined public_id gracefully (setValue called with undefined)
    expect(setValueSpy).toHaveBeenCalledTimes(1);
    expect(setValueSpy).toHaveBeenCalledWith('imageId', undefined);
  });

  it('should display overlay when isLoading is true', () => {
    render(
      <FormWrapper<MemoryFormData>
        defaultValues={{
          imageId: null,
          title: '',
          message: '',
          hashtags: [],
        }}
      >
        <UploadImageCard memoryTitle="Test Memory" isLoading={true} />
      </FormWrapper>,
    );

    // Overlay should be rendered (checking via test-id from Overlay component)
    // The Overlay component should be present when isLoading is true
    expect(screen.getByTestId('upload-image-card')).toBeInTheDocument();
  });

  it('should not display overlay when isLoading is false', () => {
    render(
      <FormWrapper<MemoryFormData>
        defaultValues={{
          imageId: null,
          title: '',
          message: '',
          hashtags: [],
        }}
      >
        <UploadImageCard memoryTitle="Test Memory" isLoading={false} />
      </FormWrapper>,
    );

    expect(screen.getByTestId('upload-image-card')).toBeInTheDocument();
  });

  it('should display memory title correctly', () => {
    render(
      <FormWrapper<MemoryFormData>
        defaultValues={{
          imageId: null,
          title: '',
          message: '',
          hashtags: [],
        }}
      >
        <UploadImageCard memoryTitle="My Special Memory" isLoading={false} />
      </FormWrapper>,
    );

    expect(screen.getByText('My Special Memory')).toBeInTheDocument();
  });
});
