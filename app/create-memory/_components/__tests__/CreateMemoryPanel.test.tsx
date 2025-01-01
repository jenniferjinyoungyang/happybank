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
    const hashtagInputBox = screen.getByLabelText('Hashtag #');

    await userEvent.type(titleInputBox, 'Ginger day');
    await userEvent.type(messageTextBox, 'I met Ginger today!');
    await userEvent.type(hashtagInputBox, 'ginger');

    expect(titleInputBox).toHaveValue('Ginger day');
    expect(messageTextBox).toHaveValue('I met Ginger today!');
    expect(hashtagInputBox).toHaveValue('ginger');

    const withinUploadImageCard = within(screen.getByTestId('upload-image-card'));
    expect(withinUploadImageCard.getByText('Ginger day')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(createMemorySpy).toHaveBeenCalledTimes(1);
    expect(createMemorySpy).toHaveBeenCalledWith({
      title: 'Ginger day',
      message: 'I met Ginger today!',
      hashtag: 'ginger',
      imageId: null,
    });

    expect(titleInputBox).toHaveValue('');
    expect(messageTextBox).toHaveValue('');
    expect(hashtagInputBox).toHaveValue('');
  });

  it('should display alert if create memory request is failed', async () => {
    createMemorySpy.mockResolvedValue(makeApiErrorMock('unknown error'));

    render(<CreateMemoryPanel />);

    const titleInputBox = screen.getByLabelText('Title');
    const messageTextBox = screen.getByLabelText('Message');
    const hashtagInputBox = screen.getByLabelText('Hashtag #');

    await userEvent.type(titleInputBox, 'Ginger day');
    await userEvent.type(messageTextBox, 'I met Ginger today!');
    await userEvent.type(hashtagInputBox, 'ginger');

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(createMemorySpy).toHaveBeenCalledTimes(1);

    expect(titleInputBox).toHaveValue('Ginger day');
    expect(messageTextBox).toHaveValue('I met Ginger today!');
    expect(hashtagInputBox).toHaveValue('ginger');

    expect(screen.getByText('Error creating memory')).toBeInTheDocument();
  });
});
