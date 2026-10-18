import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { appendUniqueTags, HashtagsInput, parseHashtags } from '../HashtagsInput';

describe('HashtagsInput & helper functions', () => {
  describe('parseHashtags', () => {
    it('parses comma-separated tags, trims whitespace and removes hash prefixes', () => {
      expect(parseHashtags(' #tag1,  tag2, #tag3, ')).toEqual(['tag1', 'tag2', 'tag3']);
    });

    it('returns empty array when input contains no valid tags', () => {
      expect(parseHashtags('')).toEqual([]);
      expect(parseHashtags(' , , ')).toEqual([]);
    });
  });

  describe('appendUniqueTags', () => {
    it('appends only unique valid tags to existing tags', () => {
      expect(appendUniqueTags(['a', 'b'], 'b, c, #d')).toEqual(['a', 'b', 'c', 'd']);
    });

    it('returns copy of existing tags when new tags input is empty or invalid', () => {
      expect(appendUniqueTags(['a', 'b'], ' , ')).toEqual(['a', 'b']);
    });
  });

  describe('HashtagsInput component', () => {
    it('renders with default props and shows placeholder when hashtags are empty', () => {
      const onChange = jest.fn();
      render(<HashtagsInput hashtags={[]} onChange={onChange} />);

      const input = document.getElementById('hashtags-input') as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(screen.getByPlaceholderText('gratitude, weekend, family')).toBeInTheDocument();
    });

    it('renders hashtag chips and hides placeholder when hashtags are present', () => {
      const onChange = jest.fn();
      render(
        <HashtagsInput
          id="custom-hashtags"
          hashtags={['joy', 'sunshine']}
          onChange={onChange}
          placeholder="custom placeholder"
        />,
      );

      expect(screen.getByText('#joy')).toBeInTheDocument();
      expect(screen.getByText('#sunshine')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('custom placeholder')).not.toBeInTheDocument();
    });

    it('adds hashtag on Enter, Space, and Comma with uncontrolled input', async () => {
      const onChange = jest.fn();
      render(<HashtagsInput hashtags={['first']} onChange={onChange} />);
      const input = document.getElementById('hashtags-input') as HTMLInputElement;

      await userEvent.type(input, 'happy{Enter}');
      expect(onChange).toHaveBeenCalledWith(['first', 'happy']);

      await userEvent.type(input, 'smile ');
      expect(onChange).toHaveBeenCalledWith(['first', 'smile']);

      await userEvent.type(input, 'cheer,');
      expect(onChange).toHaveBeenCalledWith(['first', 'cheer']);
    });

    it('prevents default on Space or Comma when input is empty', async () => {
      const onChange = jest.fn();
      render(<HashtagsInput hashtags={[]} onChange={onChange} />);
      const input = document.getElementById('hashtags-input') as HTMLInputElement;

      await userEvent.type(input, ' ');
      await userEvent.type(input, ',');

      expect(onChange).not.toHaveBeenCalled();
      expect(input).toHaveValue('');
    });

    it('removes last hashtag when Backspace is pressed on empty input', async () => {
      const onChange = jest.fn();
      render(<HashtagsInput hashtags={['one', 'two']} onChange={onChange} />);
      const input = document.getElementById('hashtags-input') as HTMLInputElement;

      input.focus();
      await userEvent.keyboard('{Backspace}');

      expect(onChange).toHaveBeenCalledWith(['one']);
    });

    it('does not remove hashtag when Backspace is pressed on empty input with no hashtags', async () => {
      const onChange = jest.fn();
      render(<HashtagsInput hashtags={[]} onChange={onChange} />);
      const input = document.getElementById('hashtags-input') as HTMLInputElement;

      input.focus();
      await userEvent.keyboard('{Backspace}');

      expect(onChange).not.toHaveBeenCalled();
    });

    it('does not remove hashtag when Backspace is pressed on non-empty input', async () => {
      const onChange = jest.fn();
      render(<HashtagsInput hashtags={['one']} onChange={onChange} />);
      const input = document.getElementById('hashtags-input') as HTMLInputElement;

      await userEvent.type(input, 'ab');
      await userEvent.keyboard('{Backspace}');

      expect(onChange).not.toHaveBeenCalled();
      expect(input).toHaveValue('a');
    });

    it('removes hashtag when remove button is clicked and stops event propagation', async () => {
      const onChange = jest.fn();
      render(<HashtagsInput hashtags={['tag1', 'tag2']} onChange={onChange} />);

      const removeBtn = screen.getByRole('button', { name: 'Remove #tag1' });
      await userEvent.click(removeBtn);

      expect(onChange).toHaveBeenCalledWith(['tag2']);
    });

    it('focuses input when clicking on container', async () => {
      const onChange = jest.fn();
      render(<HashtagsInput hashtags={[]} onChange={onChange} />);
      const input = document.getElementById('hashtags-input') as HTMLInputElement;
      const container = input.closest('div');

      expect(document.activeElement).not.toBe(input);
      await userEvent.click(container!);
      expect(document.activeElement).toBe(input);
    });

    it('handles input with multiple commas on change (pasting)', () => {
      const onChange = jest.fn();
      render(<HashtagsInput hashtags={['initial']} onChange={onChange} />);
      const input = document.getElementById('hashtags-input') as HTMLInputElement;

      fireEvent.change(input, { target: { value: 'tagA, tagB, trailing' } });

      expect(onChange).toHaveBeenCalledWith(['initial', 'tagA', 'tagB']);
      expect(input).toHaveValue(' trailing');
    });

    it('supports controlled inputValue and onInputValueChange', async () => {
      const onChange = jest.fn();
      const onInputValueChange = jest.fn();

      const { rerender } = render(
        <HashtagsInput
          hashtags={['test']}
          onChange={onChange}
          inputValue="current"
          onInputValueChange={onInputValueChange}
        />,
      );

      const input = document.getElementById('hashtags-input') as HTMLInputElement;
      expect(input).toHaveValue('current');

      await userEvent.type(input, 'a');
      expect(onInputValueChange).toHaveBeenCalled();

      // Test comma splitting with controlled input
      fireEvent.change(input, { target: { value: 'tag1, remaining' } });
      expect(onChange).toHaveBeenCalledWith(['test', 'tag1']);
      expect(onInputValueChange).toHaveBeenCalledWith(' remaining');

      // Test submit tag with controlled input
      rerender(
        <HashtagsInput
          hashtags={['test']}
          onChange={onChange}
          inputValue="newtag"
          onInputValueChange={onInputValueChange}
        />,
      );
      await userEvent.type(input, '{Enter}');
      expect(onChange).toHaveBeenCalledWith(['test', 'newtag']);
      expect(onInputValueChange).toHaveBeenCalledWith('');
    });
  });
});
