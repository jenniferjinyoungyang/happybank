import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { FormWrapper } from '../../../../test-helper/formWrapper';
import { MEMORY_VALIDATION } from '../../../_shared/_constants/memory';
import { MemoryCreationFields } from '../../../_shared/_types/memory';
import { CreateMemoryCard } from '../CreateMemoryCard';

// No delay so typing is deterministic and tests don't time out (e.g. 1000+ chars)
const user = userEvent.setup({ delay: null });

describe('CreateMemoryCard', () => {
  describe('Rendering', () => {
    it('should render all form fields', () => {
      render(
        <FormWrapper<MemoryCreationFields>
          defaultValues={{
            title: '',
            message: '',
            hashtags: [],
            imageId: null,
          }}
        >
          <CreateMemoryCard isLoading={false} />
        </FormWrapper>,
      );

      expect(screen.getByLabelText('Title')).toBeInTheDocument();
      expect(screen.getByLabelText('Message')).toBeInTheDocument();
      expect(screen.getByLabelText('Hashtags')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('should render hashtag input placeholder when no hashtags exist', () => {
      render(
        <FormWrapper<MemoryCreationFields>
          defaultValues={{
            title: '',
            message: '',
            hashtags: [],
            imageId: null,
          }}
        >
          <CreateMemoryCard isLoading={false} />
        </FormWrapper>,
      );

      const hashtagInput = screen.getByPlaceholderText('e.g., happy');
      expect(hashtagInput).toBeInTheDocument();
    });

    it('should not render hashtag input placeholder when hashtags exist', () => {
      render(
        <FormWrapper<MemoryCreationFields>
          defaultValues={{
            title: '',
            message: '',
            hashtags: ['happy'],
            imageId: null,
          }}
        >
          <CreateMemoryCard isLoading={false} />
        </FormWrapper>,
      );

      expect(screen.queryByPlaceholderText('e.g., happy')).not.toBeInTheDocument();
    });

    it('should display hashtag chips', () => {
      render(
        <FormWrapper<MemoryCreationFields>
          defaultValues={{
            title: '',
            message: '',
            hashtags: ['happy', 'memory'],
            imageId: null,
          }}
        >
          <CreateMemoryCard isLoading={false} />
        </FormWrapper>,
      );

      expect(screen.getByText('#happy')).toBeInTheDocument();
      expect(screen.getByText('#memory')).toBeInTheDocument();
    });

    it('should render loading spinner when isLoading is true', () => {
      render(
        <FormWrapper<MemoryCreationFields>
          defaultValues={{
            title: '',
            message: '',
            hashtags: [],
            imageId: null,
          }}
        >
          <CreateMemoryCard isLoading={true} />
        </FormWrapper>,
      );

      // Check for spinner - FullComponentSpinner should be rendered
      const spinner = document.querySelector('[class*="spinner"]') || screen.queryByRole('status');
      expect(spinner || document.querySelector('svg')).toBeInTheDocument();
    });

    it('should not render loading spinner when isLoading is false', () => {
      render(
        <FormWrapper<MemoryCreationFields>
          defaultValues={{
            title: '',
            message: '',
            hashtags: [],
            imageId: null,
          }}
        >
          <CreateMemoryCard isLoading={false} />
        </FormWrapper>,
      );

      // FullComponentSpinner has role="status"; when not loading it should not be present
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should display title validation error when title is empty', async () => {
      const user = userEvent.setup();
      const FormWrapperWithSubmit = () => {
        const methods = useForm<MemoryCreationFields>({
          defaultValues: {
            title: '',
            message: '',
            hashtags: [],
            imageId: null,
          },
        });

        const handleSubmit = methods.handleSubmit(
          () => {},
          () => {},
        );

        return (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit}>
              <CreateMemoryCard isLoading={false} />
            </form>
          </FormProvider>
        );
      };

      render(<FormWrapperWithSubmit />);

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessages = screen.getAllByText('This field is required.');
        expect(errorMessages.length).toBeGreaterThan(0);
        // Check that title error is present
        expect(
          errorMessages.some((msg) => msg.closest('div')?.querySelector('#memory-title')),
        ).toBeTruthy();
      });
    });

    it('should display title validation error when title exceeds max length', async () => {
      const FormWrapperWithSubmit = () => {
        const methods = useForm<MemoryCreationFields>({
          defaultValues: {
            title: '',
            message: '',
            hashtags: [],
            imageId: null,
          },
        });

        const handleSubmit = methods.handleSubmit(
          () => {},
          () => {},
        );

        return (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit}>
              <CreateMemoryCard isLoading={false} />
            </form>
          </FormProvider>
        );
      };

      render(<FormWrapperWithSubmit />);

      const titleInput = screen.getByLabelText('Title');
      const longTitle = 'a'.repeat(MEMORY_VALIDATION.TITLE_MAX_LENGTH + 1);

      await user.type(titleInput, longTitle);
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            `This input cannot exceed maximum length of ${MEMORY_VALIDATION.TITLE_MAX_LENGTH}.`,
          ),
        ).toBeInTheDocument();
      });
    });

    it('should display message validation error when message is empty', async () => {
      const user = userEvent.setup();
      const FormWrapperWithSubmit = () => {
        const methods = useForm<MemoryCreationFields>({
          defaultValues: {
            title: '',
            message: '',
            hashtags: [],
            imageId: null,
          },
        });

        const handleSubmit = methods.handleSubmit(
          () => {},
          () => {},
        );

        return (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit}>
              <CreateMemoryCard isLoading={false} />
            </form>
          </FormProvider>
        );
      };

      render(<FormWrapperWithSubmit />);

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessages = screen.getAllByText('This field is required.');
        expect(errorMessages.length).toBeGreaterThanOrEqual(2); // title and message
      });
    });

    it('should display message validation error when message exceeds max length', async () => {
      const FormWrapperWithSubmit = () => {
        const methods = useForm<MemoryCreationFields>({
          defaultValues: {
            title: '',
            message: '',
            hashtags: [],
            imageId: null,
          },
        });

        const handleSubmit = methods.handleSubmit(
          () => {},
          () => {},
        );

        return (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit}>
              <CreateMemoryCard isLoading={false} />
            </form>
          </FormProvider>
        );
      };

      render(<FormWrapperWithSubmit />);

      const messageInput = screen.getByLabelText('Message');
      const longMessage = 'a'.repeat(MEMORY_VALIDATION.MESSAGE_MAX_LENGTH + 1);

      await user.type(messageInput, longMessage);
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            `This input cannot exceed maximum length of ${MEMORY_VALIDATION.MESSAGE_MAX_LENGTH}.`,
          ),
        ).toBeInTheDocument();
      });
    }, 15000);

    it('should display hashtag validation error when hashtag count exceeds max', async () => {
      const FormWrapperWithSubmit = () => {
        const methods = useForm<MemoryCreationFields>({
          defaultValues: {
            title: 'Test',
            message: 'Test',
            hashtags: Array.from(
              { length: MEMORY_VALIDATION.HASHTAG_MAX_COUNT },
              (_, i) => `tag${i}`,
            ),
            imageId: null,
          },
        });

        const handleSubmit = methods.handleSubmit(
          () => {},
          () => {},
        );

        return (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit}>
              <CreateMemoryCard isLoading={false} />
            </form>
          </FormProvider>
        );
      };

      render(<FormWrapperWithSubmit />);

      const hashtagInput = document.getElementById('memory-hashtags') as HTMLInputElement;

      await user.type(hashtagInput, 'extra{Enter}');

      await waitFor(() => {
        expect(
          screen.getByText(
            `You can only add up to ${MEMORY_VALIDATION.HASHTAG_MAX_COUNT} hashtags.`,
          ),
        ).toBeInTheDocument();
      });
    });

    it('should display hashtag validation error when hashtag length exceeds max', async () => {
      render(
        <FormWrapper<MemoryCreationFields>
          defaultValues={{
            title: '',
            message: '',
            hashtags: [],
            imageId: null,
          }}
        >
          <CreateMemoryCard isLoading={false} />
        </FormWrapper>,
      );

      const hashtagInput = document.getElementById('memory-hashtags') as HTMLInputElement;
      const longHashtag = 'a'.repeat(MEMORY_VALIDATION.HASHTAG_MAX_LENGTH + 1);

      await user.type(hashtagInput, `${longHashtag}{Enter}`);

      await waitFor(() => {
        expect(
          screen.getByText(
            `Each hashtag cannot exceed ${MEMORY_VALIDATION.HASHTAG_MAX_LENGTH} characters.`,
          ),
        ).toBeInTheDocument();
      });
    });

    it('should render correctly when hashtags is in defaultValues', () => {
      // CreateMemoryCard expects hashtags to be in defaultValues (as set by CreateMemoryPanel)
      // React Hook Form's watch() returns defaultValues even before field registration
      const FormWrapperWithHashtags = () => {
        const methods = useForm<MemoryCreationFields>({
          defaultValues: {
            title: '',
            message: '',
            hashtags: [], // Always provided by CreateMemoryPanel
            imageId: null,
          },
        });

        return (
          <FormProvider {...methods}>
            <CreateMemoryCard isLoading={false} />
          </FormProvider>
        );
      };

      render(<FormWrapperWithHashtags />);

      // Component should render without errors
      expect(screen.getByLabelText('Hashtags')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('e.g., happy')).toBeInTheDocument();
    });

    it('should validate successfully when hashtags is empty array', async () => {
      // Test validation with empty array (production scenario)
      // In production, hashtags is always [] from CreateMemoryPanel's defaultValues
      const FormWrapperWithEmptyHashtags = () => {
        const methods = useForm<MemoryCreationFields>({
          defaultValues: {
            title: 'Test',
            message: 'Test',
            hashtags: [], // Production always uses empty array
            imageId: null,
          },
        });

        const handleSubmit = methods.handleSubmit(
          () => {},
          () => {},
        );

        return (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit}>
              <CreateMemoryCard isLoading={false} />
            </form>
          </FormProvider>
        );
      };

      render(<FormWrapperWithEmptyHashtags />);

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      // Should not show hashtag validation error when value is empty array
      // Empty array passes validation (length check passes for empty array)
      await waitFor(() => {
        const errorMessages = screen.queryAllByText(
          /You can only add up to|Each hashtag cannot exceed/i,
        );
        expect(errorMessages).toHaveLength(0);
      });
    });
  });

  describe('Hashtag Input Behavior', () => {
    it('should add hashtag when Enter key is pressed', async () => {
      const user = userEvent.setup();
      render(
        <FormWrapper<MemoryCreationFields>
          defaultValues={{
            title: '',
            message: '',
            hashtags: [],
            imageId: null,
          }}
        >
          <CreateMemoryCard isLoading={false} />
        </FormWrapper>,
      );

      const hashtagInput = document.getElementById('memory-hashtags') as HTMLInputElement;

      await user.type(hashtagInput, 'happy{Enter}');

      await waitFor(() => {
        expect(screen.getByText('#happy')).toBeInTheDocument();
      });
      expect(hashtagInput).toHaveValue('');
    });

    it('should add hashtag when Space key is pressed', async () => {
      render(
        <FormWrapper<MemoryCreationFields>
          defaultValues={{
            title: '',
            message: '',
            hashtags: [],
            imageId: null,
          }}
        >
          <CreateMemoryCard isLoading={false} />
        </FormWrapper>,
      );

      const hashtagInput = document.getElementById('memory-hashtags') as HTMLInputElement;

      await user.type(hashtagInput, 'happy ');

      await waitFor(() => {
        expect(screen.getByText('#happy')).toBeInTheDocument();
      });
      expect(hashtagInput).toHaveValue('');
    });

    it('should remove # prefix when adding hashtag', async () => {
      const user = userEvent.setup();
      render(
        <FormWrapper<MemoryCreationFields>
          defaultValues={{
            title: '',
            message: '',
            hashtags: [],
            imageId: null,
          }}
        >
          <CreateMemoryCard isLoading={false} />
        </FormWrapper>,
      );

      const hashtagInput = document.getElementById('memory-hashtags') as HTMLInputElement;

      await user.type(hashtagInput, '#happy{Enter}');

      await waitFor(() => {
        expect(screen.getByText('#happy')).toBeInTheDocument();
      });
    });

    it('should trim whitespace when adding hashtag', async () => {
      render(
        <FormWrapper<MemoryCreationFields>
          defaultValues={{
            title: '',
            message: '',
            hashtags: [],
            imageId: null,
          }}
        >
          <CreateMemoryCard isLoading={false} />
        </FormWrapper>,
      );

      const hashtagInput = document.getElementById('memory-hashtags') as HTMLInputElement;

      await user.type(hashtagInput, '  happy  {Enter}');

      await waitFor(() => {
        expect(screen.getByText('#happy')).toBeInTheDocument();
      });
    });

    it('should not add empty hashtag', async () => {
      const user = userEvent.setup();
      render(
        <FormWrapper<MemoryCreationFields>
          defaultValues={{
            title: '',
            message: '',
            hashtags: [],
            imageId: null,
          }}
        >
          <CreateMemoryCard isLoading={false} />
        </FormWrapper>,
      );

      const hashtagInput = document.getElementById('memory-hashtags') as HTMLInputElement;

      await user.type(hashtagInput, '   {Enter}');

      // No empty hashtag chip (e.g. "#" alone) should be added
      expect(screen.queryByText('#')).not.toBeInTheDocument();
    });

    it('should not add duplicate hashtags', async () => {
      render(
        <FormWrapper<MemoryCreationFields>
          defaultValues={{
            title: '',
            message: '',
            hashtags: ['happy'],
            imageId: null,
          }}
        >
          <CreateMemoryCard isLoading={false} />
        </FormWrapper>,
      );

      const hashtagInput = document.getElementById('memory-hashtags') as HTMLInputElement;
      expect(screen.getAllByText('#happy')).toHaveLength(1);

      await user.type(hashtagInput, 'happy{Enter}');

      // Should still only have one hashtag (duplicate not added)
      await waitFor(() => {
        const hashtags = screen.getAllByText('#happy');
        expect(hashtags).toHaveLength(1);
      });
    });

    it('should remove hashtag when clicking remove button', async () => {
      const user = userEvent.setup();
      render(
        <FormWrapper<MemoryCreationFields>
          defaultValues={{
            title: '',
            message: '',
            hashtags: ['happy', 'memory'],
            imageId: null,
          }}
        >
          <CreateMemoryCard isLoading={false} />
        </FormWrapper>,
      );

      expect(screen.getByText('#happy')).toBeInTheDocument();
      expect(screen.getByText('#memory')).toBeInTheDocument();

      // Find the remove button for 'happy' hashtag
      const happyChip = screen.getByText('#happy').closest('span');
      const removeButton = within(happyChip!).getByRole('button');

      await user.click(removeButton);

      await waitFor(() => {
        expect(screen.queryByText('#happy')).not.toBeInTheDocument();
      });
      expect(screen.getByText('#memory')).toBeInTheDocument();
    });

    it('should remove last hashtag when Backspace is pressed on empty input', async () => {
      render(
        <FormWrapper<MemoryCreationFields>
          defaultValues={{
            title: '',
            message: '',
            hashtags: ['happy', 'memory'],
            imageId: null,
          }}
        >
          <CreateMemoryCard isLoading={false} />
        </FormWrapper>,
      );

      const hashtagInput = document.getElementById('memory-hashtags') as HTMLInputElement;

      expect(screen.getByText('#memory')).toBeInTheDocument();
      expect(hashtagInput).toHaveValue('');

      // Focus input (which is empty) and press Backspace
      await user.click(hashtagInput);
      // Ensure input is focused and empty
      expect(document.activeElement).toBe(hashtagInput);
      await user.keyboard('{Backspace}');

      await waitFor(() => {
        expect(screen.queryByText('#memory')).not.toBeInTheDocument();
      });
      expect(screen.getByText('#happy')).toBeInTheDocument();
    });

    it('should not remove hashtag when Backspace is pressed on non-empty input', async () => {
      render(
        <FormWrapper<MemoryCreationFields>
          defaultValues={{
            title: '',
            message: '',
            hashtags: ['happy'],
            imageId: null,
          }}
        >
          <CreateMemoryCard isLoading={false} />
        </FormWrapper>,
      );

      const hashtagInput = document.getElementById('memory-hashtags') as HTMLInputElement;

      await user.type(hashtagInput, 'test');
      await user.keyboard('{Backspace}');

      // Hashtag should still be there
      expect(screen.getByText('#happy')).toBeInTheDocument();
      expect(hashtagInput).toHaveValue('tes');
    });

    it('should not remove hashtag when Backspace is pressed on empty input with no hashtags', async () => {
      const user = userEvent.setup();
      render(
        <FormWrapper<MemoryCreationFields>
          defaultValues={{
            title: '',
            message: '',
            hashtags: [],
            imageId: null,
          }}
        >
          <CreateMemoryCard isLoading={false} />
        </FormWrapper>,
      );

      const hashtagInput = document.getElementById('memory-hashtags') as HTMLInputElement;

      hashtagInput.focus();
      await user.keyboard('{Backspace}');

      // Should not crash or error
      expect(hashtagInput).toBeInTheDocument();
    });
  });

  describe('Form Reset on Success', () => {
    it('should clear hashtag input when form is successfully submitted', async () => {
      const FormWrapperWithReset = () => {
        const methods = useForm<MemoryCreationFields>({
          defaultValues: {
            title: '',
            message: '',
            hashtags: [],
            imageId: null,
          },
        });

        const handleSuccess = async () => {
          // Simulate successful form submission
          await methods.handleSubmit(
            () => {
              // On success, reset form which should trigger isSubmitSuccessful
              methods.reset({ title: '', message: '', hashtags: [], imageId: null });
            },
            () => {},
          )();
        };

        return (
          <FormProvider {...methods}>
            <CreateMemoryCard isLoading={false} />
            <button onClick={handleSuccess}>Simulate Success</button>
          </FormProvider>
        );
      };

      render(<FormWrapperWithReset />);

      const hashtagInput = document.getElementById('memory-hashtags') as HTMLInputElement;

      // Add a hashtag first
      await user.type(hashtagInput, 'happy{Enter}');
      expect(hashtagInput).toHaveValue('');

      // Type something in the input
      await user.type(hashtagInput, 'test');
      expect(hashtagInput).toHaveValue('test');

      // Fill required fields and submit to trigger success
      await user.type(screen.getByLabelText('Title'), 'Test Title');
      await user.type(screen.getByLabelText('Message'), 'Test Message');
      await user.click(screen.getByRole('button', { name: 'Simulate Success' }));

      // The input should be cleared when form successfully submits (via useEffect watching isSubmitSuccessful)
      await waitFor(
        () => {
          expect(hashtagInput).toHaveValue('');
        },
        { timeout: 3000 },
      );
    });
  });
});
