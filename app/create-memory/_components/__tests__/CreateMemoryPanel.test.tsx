import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makeApiErrorMock, makeApiSuccessMock } from '../../../../test-helper/makeMock';
import * as CreateMemoryModule from '../../_api/createMemory';
import { CreateMemoryPanel } from '../CreateMemoryPanel';

jest.mock('../../_api/createMemory');

describe('CreateMemoryPanel', () => {
  let createMemorySpy: jest.SpyInstance<ReturnType<typeof CreateMemoryModule.createMemory>>;

  beforeEach(() => {
    createMemorySpy = jest
      .spyOn(CreateMemoryModule, 'createMemory')
      .mockResolvedValue(makeApiSuccessMock(null));
  });

  it('should call createMemory api when memory data is submitted', async () => {
    render(<CreateMemoryPanel />);

    const titleInputBox = screen.getByLabelText('Title');
    const messageTextBox = screen.getByLabelText('Message');
    const hashtagsInputBox = screen.getByLabelText('Hashtags');

    await userEvent.type(titleInputBox, 'Ginger day');
    await userEvent.type(messageTextBox, 'I met Ginger today!');
    await userEvent.type(hashtagsInputBox, 'ginger{enter}');
    await userEvent.type(hashtagsInputBox, 'happy{enter}');

    expect(titleInputBox).toHaveValue('Ginger day');
    expect(messageTextBox).toHaveValue('I met Ginger today!');
    expect(hashtagsInputBox).toHaveValue('');
    expect(await screen.findByText('#ginger')).toBeInTheDocument();
    expect(await screen.findByText('#happy')).toBeInTheDocument();

    const withinUploadImageCard = within(screen.getByTestId('upload-image-card'));
    expect(withinUploadImageCard.getByText('Ginger day')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(createMemorySpy).toHaveBeenCalledTimes(1);
    expect(createMemorySpy).toHaveBeenCalledWith({
      title: 'Ginger day',
      message: 'I met Ginger today!',
      hashtags: ['ginger', 'happy'],
      imageId: null,
    });

    await waitFor(() => {
      expect(titleInputBox).toHaveValue('');
    });
    expect(messageTextBox).toHaveValue('');
    expect(hashtagsInputBox).toHaveValue('');
    expect(screen.queryByText('#ginger')).not.toBeInTheDocument();
    expect(screen.queryByText('#happy')).not.toBeInTheDocument();
  });

  it('should display alert if create memory request is failed', async () => {
    createMemorySpy.mockResolvedValue(makeApiErrorMock('unknown error'));

    render(<CreateMemoryPanel />);

    const titleInputBox = screen.getByLabelText('Title');
    const messageTextBox = screen.getByLabelText('Message');
    const hashtagsInputBox = screen.getByLabelText('Hashtags');

    await userEvent.type(titleInputBox, 'Ginger day');
    await userEvent.type(messageTextBox, 'I met Ginger today!');
    await userEvent.type(hashtagsInputBox, 'ginger{enter}');

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(createMemorySpy).toHaveBeenCalledTimes(1);

    expect(titleInputBox).toHaveValue('Ginger day');
    expect(messageTextBox).toHaveValue('I met Ginger today!');
    expect(hashtagsInputBox).toHaveValue('');
    expect(screen.getByText('#ginger')).toBeInTheDocument();

    expect(screen.getByText('Error creating memory')).toBeInTheDocument();
  });

  it('should submit form with empty hashtags array when no hashtags are provided', async () => {
    // Verify that hashtags is always an array (from defaultValues)
    // React Hook Form ensures hashtags is always [] due to defaultValues,
    // so no fallback is needed
    render(<CreateMemoryPanel />);

    const titleInputBox = screen.getByLabelText('Title');
    const messageTextBox = screen.getByLabelText('Message');

    await userEvent.type(titleInputBox, 'Test memory');
    await userEvent.type(messageTextBox, 'Test message');

    // Submit form without adding any hashtags
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(createMemorySpy).toHaveBeenCalledTimes(1);
    // Verify hashtags is always an array (from defaultValues, no fallback needed)
    expect(createMemorySpy).toHaveBeenCalledWith({
      title: 'Test memory',
      message: 'Test message',
      hashtags: [], // Always an array due to defaultValues
      imageId: null,
    });
  });
});
