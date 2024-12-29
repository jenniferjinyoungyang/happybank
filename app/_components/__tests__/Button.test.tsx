import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('correctly applies props passed in', () => {
    render(<Button type="button" label="test" cssWrapper="w-96" />);

    const button = screen.getByRole('button', { name: 'test' });

    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('w-96');
  });
});
