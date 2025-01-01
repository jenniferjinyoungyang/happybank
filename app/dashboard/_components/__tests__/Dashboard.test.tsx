import { render, screen } from '@testing-library/react';
import * as NextAuthReactModule from 'next-auth/react';
import { makeApiErrorMock, makeApiSuccessMock } from '../../../../test-helper/makeMock';
import { makeMemoryMock } from '../../../_shared/__mocks__/memory.mock';
import { makeSessionMock } from '../../../_shared/__mocks__/session.mock';
import * as GetMemoryModule from '../../_api/getMemory';
import { Dashboard } from '../Dashboard';

jest.mock('../../_api/getMemory');

describe('Dashboard', () => {
  let getMemorySpy: jest.SpyInstance<ReturnType<typeof GetMemoryModule.getMemory>>;

  beforeEach(() => {
    jest
      .spyOn(NextAuthReactModule, 'useSession')
      .mockReturnValue({ data: makeSessionMock(), status: 'authenticated', update: jest.fn() });

    getMemorySpy = jest
      .spyOn(GetMemoryModule, 'getMemory')
      .mockResolvedValue(makeApiSuccessMock([makeMemoryMock()]));
  });

  it('should render an error message when it fails to fetch a memory', async () => {
    getMemorySpy.mockResolvedValue(makeApiErrorMock());
    render(<Dashboard />);
    expect(await screen.findByText('error loading data')).toBeInTheDocument();
  });

  it('should render a loading message when it is fetching a memory', async () => {
    render(<Dashboard />);
    expect(screen.getByText('loading data...')).toBeInTheDocument();

    expect(await screen.findByText('loading data...')).not.toBeInTheDocument();
  });

  it('should render an empty dashboard when no memory exists', async () => {
    getMemorySpy.mockResolvedValue(makeApiSuccessMock([]));

    render(<Dashboard />);
    expect(await screen.findByText("You don't have any memories yet.")).toBeInTheDocument();
  });

  it('should render a memory card when successfully fetches a memory', async () => {
    render(<Dashboard />);

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'This is your memory from Monday, December 30, 2024',
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole('heading', { level: 4, name: 'Test title' })).toBeInTheDocument();
    expect(screen.getByText('mock memory for testing purposes')).toBeInTheDocument();

    expect(screen.getByAltText('uploaded image')).toHaveAttribute(
      'src',
      'https://res.cloudinary.com/dujcvkecm/image/upload/c_limit,w_3840/f_auto/q_auto/v1/ginger_hello?_a=BAVAZGDW0',
    );
    expect(screen.queryByAltText('polaroid icon')).not.toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Recall' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Deposit' })).toHaveAttribute('href', '/create-memory');
  });

  it('should render a polaroid icon when successfully fetched memory does not have image id', async () => {
    getMemorySpy.mockResolvedValue(makeApiSuccessMock([makeMemoryMock({ imageId: null })]));

    render(<Dashboard />);

    expect(
      await screen.findByRole('heading', { level: 4, name: 'Test title' }),
    ).toBeInTheDocument();

    expect(screen.getByAltText('polaroid icon')).toHaveAttribute(
      'src',
      '/_next/image?url=%2Fimg.jpg&w=3840&q=75',
    );

    expect(screen.queryByAltText('uploaded image')).not.toBeInTheDocument();
  });
});
