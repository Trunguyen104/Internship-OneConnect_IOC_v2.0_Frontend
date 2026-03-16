import SearchBar from '@/components/ui/SearchBar';
import { BACKLOG_UI } from '@/constants/backlog/uiText';

export const BoardHeader = ({ searchText, setSearchText }) => {
  return (
    <div className='sticky top-0 z-10 mb-6 pt-1'>
      <SearchBar
        value={searchText}
        onChange={setSearchText}
        placeholder={BACKLOG_UI.SEARCH_PLACEHOLDER}
        showFilter
        width='w-[360px]'
      />
    </div>
  );
};
