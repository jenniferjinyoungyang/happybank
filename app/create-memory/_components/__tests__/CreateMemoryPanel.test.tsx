import { render, screen, within } from '@testing-library/react';
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
    const hashtagsInputBox = screen.getByLabelText('Hashtags (comma-separated)');

    await userEvent.type(titleInputBox, 'Ginger day');
    await userEvent.type(messageTextBox, 'I met Ginger today!');
    await userEvent.type(hashtagsInputBox, 'ginger, happy');

    expect(titleInputBox).toHaveValue('Ginger day');
    expect(messageTextBox).toHaveValue('I met Ginger today!');
    expect(hashtagsInputBox).toHaveValue('ginger, happy');

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

    expect(titleInputBox).toHaveValue('');
    expect(messageTextBox).toHaveValue('');
    expect(hashtagsInputBox).toHaveValue('');
  });

  it('should display alert if create memory request is failed', async () => {
    createMemorySpy.mockResolvedValue(makeApiErrorMock('unknown error'));

    render(<CreateMemoryPanel />);

    const titleInputBox = screen.getByLabelText('Title');
    const messageTextBox = screen.getByLabelText('Message');
    const hashtagsInputBox = screen.getByLabelText('Hashtags (comma-separated)');

    await userEvent.type(titleInputBox, 'Ginger day');
    await userEvent.type(messageTextBox, 'I met Ginger today!');
    await userEvent.type(hashtagsInputBox, 'ginger');

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(createMemorySpy).toHaveBeenCalledTimes(1);

    expect(titleInputBox).toHaveValue('Ginger day');
    expect(messageTextBox).toHaveValue('I met Ginger today!');
    expect(hashtagsInputBox).toHaveValue('ginger');

    expect(screen.getByText('Error creating memory')).toBeInTheDocument();
  });
});
