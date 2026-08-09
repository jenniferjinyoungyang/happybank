import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as NextAuthReactModule from 'next-auth/react';
import { makeApiErrorMock, makeApiSuccessMock } from '../../../../test-helper/makeMock';
import { makeMemoryMock } from '../../../_shared/__mocks__/memory.mock';
import { makeSessionMock } from '../../../_shared/__mocks__/session.mock';
import * as GetMemoryModule from '../../_api/getMemory';
import * as GetMemoryStatsModule from '../../_api/getMemoryStats';
import * as GetCurationsModule from '../../_api/getCurations';
import { Dashboard } from '../Dashboard';

jest.mock('../../_api/getMemory');
jest.mock('../../_api/getMemoryStats');
jest.mock('../../_api/getCurations');

describe('Dashboard', () => {
  let getMemorySpy: jest.SpyInstance<ReturnType<typeof GetMemoryModule.getMemory>>;

  beforeEach(() => {
    jest
      .spyOn(NextAuthReactModule, 'useSession')
      .mockReturnValue({ data: makeSessionMock(), status: 'authenticated', update: jest.fn() });

    jest.spyOn(GetMemoryStatsModule, 'getMemoryStats').mockResolvedValue(
      makeApiSuccessMock({
        memoryCount: 12,
        hashtagCount: 42,
        oldestMemoryDate: '2024-01-01T00:00:00.000Z',
        latestMemoryDate: '2024-12-31T00:00:00.000Z',
      }),
    );

    jest.spyOn(GetCurationsModule, 'getCurations').mockResolvedValue(
      makeApiSuccessMock([
        { id: 1, name: 'vietnam trip', count: 15, imageId: 'vietnam-img' },
        { id: 2, name: 'mountain hike', count: 5, imageId: 'mountain-img' },
      ]),
    );

    getMemorySpy = jest
      .spyOn(GetMemoryModule, 'getMemory')
      .mockResolvedValue(makeApiSuccessMock(makeMemoryMock()));
  });

  it('should render an error message when it fails to fetch a memory', async () => {
    getMemorySpy.mockResolvedValue(makeApiErrorMock());
    render(<Dashboard />);
    expect(await screen.findByText('error loading data')).toBeInTheDocument();
  });

  it('should render a loading message when it is fetching a memory', async () => {
    render(<Dashboard />);
    expect(screen.getByRole('status')).toBeInTheDocument();

    expect(await screen.findByRole('status')).not.toBeInTheDocument();
  });

  it('should render an empty dashboard when no memory exists', async () => {
    getMemorySpy.mockResolvedValue(makeApiSuccessMock(null));

    render(<Dashboard />);
    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: "Let's start saving your special memories",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("You don't have any memories yet.")).toBeInTheDocument();
    expect(screen.getByAltText('polaroid icon')).toHaveAttribute(
      'src',
      '/_next/image?url=%2Fimg.jpg&w=3840&q=75',
    );
    expect(screen.getByRole('link', { name: /Deposit memory/i })).toHaveAttribute(
      'href',
      '/create-memory',
    );
    expect(screen.getByRole('button', { name: /Recall/i })).toBeDisabled();
  });

  it('should render a memory card when successfully fetches a memory', async () => {
    render(<Dashboard />);

    expect(await screen.findByText('Memory of the Moment')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Test title' })).toBeInTheDocument();
    expect(screen.getByText(/mock memory for testing purposes/i)).toBeInTheDocument();

    const imageElement = screen.getByAltText('uploaded image');
    expect(imageElement).toHaveAttribute('src');
    // Cloudinary URLs have non-deterministic signatures, so check for the base URL pattern
    expect(imageElement.getAttribute('src')).toMatch(
      /^https:\/\/res\.cloudinary\.com\/dujcvkecm\/image\/upload\/c_limit,w_3840\/f_auto\/q_auto\/v1\/ginger_hello\?_a=/,
    );
    expect(screen.queryByAltText('polaroid icon')).not.toBeInTheDocument();

    expect(screen.getByRole('link', { name: /Deposit memory/i })).toHaveAttribute(
      'href',
      '/create-memory',
    );
    expect(screen.getByRole('button', { name: /Recall/i })).toBeInTheDocument();

    expect(await screen.findByText('moments stored')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Jan 2024')).toBeInTheDocument();
    expect(screen.getByText('Dec 2024')).toBeInTheDocument();
    expect(screen.getByText('TIMELINE')).toBeInTheDocument();
  });

  it('should render a polaroid icon when successfully fetched memory does not have image id', async () => {
    getMemorySpy.mockResolvedValue(makeApiSuccessMock(makeMemoryMock({ imageId: null })));

    render(<Dashboard />);

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Test title' }),
    ).toBeInTheDocument();

    expect(screen.getByAltText('polaroid icon')).toHaveAttribute(
      'src',
      '/_next/image?url=%2Fimg.jpg&w=3840&q=75',
    );

    expect(screen.queryByAltText('uploaded image')).not.toBeInTheDocument();
  });

  it('should load another memory when recall button is clicked', async () => {
    render(<Dashboard />);

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Test title' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/mock memory for testing purposes/i)).toBeInTheDocument();

    expect(getMemorySpy).toHaveBeenCalledTimes(1);

    getMemorySpy.mockResolvedValue(
      makeApiSuccessMock(
        makeMemoryMock({
          title: 'Another test memory',
          message: 'test for recall button',
          createdAt: new Date('2024-12-27T10:00:00.000-05:00'),
          imageId: 'test-image',
        }),
      ),
    );

    await userEvent.click(screen.getByRole('button', { name: /Recall/i }));

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Another test memory' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/test for recall button/i)).toBeInTheDocument();

    expect(getMemorySpy).toHaveBeenCalledTimes(2);
  });

  it('should display hashtag chips when memory has hashtags', async () => {
    getMemorySpy.mockResolvedValue(
      makeApiSuccessMock(
        makeMemoryMock({
          hashtags: ['happy', 'memory'],
        }),
      ),
    );

    render(<Dashboard />);

    expect(await screen.findByText('#happy')).toBeInTheDocument();
    expect(screen.getByText('#memory')).toBeInTheDocument();
  });

  it('should not display hashtag chips when memory has no hashtags', async () => {
    getMemorySpy.mockResolvedValue(makeApiSuccessMock(makeMemoryMock()));

    render(<Dashboard />);

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Test title' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('#happy')).not.toBeInTheDocument();
    expect(screen.queryByText('#memory')).not.toBeInTheDocument();
  });

  it('should render the curations panel when curations are fetched successfully', async () => {
    render(<Dashboard />);

    expect(await screen.findByRole('heading', { level: 2, name: 'Curations' })).toBeInTheDocument();
    expect(screen.getByText('#Vietnam Trip')).toBeInTheDocument();
    expect(screen.getByText('15 memories')).toBeInTheDocument();
    expect(screen.getByText('#Mountain Hike')).toBeInTheDocument();
    expect(screen.getByText('5 memories')).toBeInTheDocument();
  });
});
