import { Button, DropdownMenu, Flex } from '@radix-ui/themes';
import { ColDef, ColGroupDef, colorSchemeDark, IDatasource, IGetRowsParams, themeQuartz } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Method, sendRequest } from '../../../clients/api';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { getCurrentTeam } from '../../../state/selectors/teams';
import { Link } from '../link';
/**
 * ProjectsTable component renders a table with project data using AgGridReact.
 * It supports infinite scrolling, sorting, filtering, and pagination.
 *
 * @param {Object} props - The component props.
 * @param {number} props.refresh - A number that triggers the refresh of the data source when changed.
 *
 * @returns {JSX.Element} The rendered ProjectsTable component.
 *
 * @remarks
 * - The table columns include "Name", "Schedules", and "Actions".
 * - The "Schedules" column contains a link to view project schedules.
 * - The "Actions" column contains a dropdown menu with options to edit or delete a project.
 * - The data source is created using `useMemo` and fetches data asynchronously.
 * - The component uses `useSelector` to get the current team and `useDarkMode` to determine the dark mode state.
 * - The table's loading state is managed using a `useState` hook.
 */
const ProjectsTable = ({ refresh }: { refresh: number }): JSX.Element => {
  /**
   * Represents the current team.
   */
  const currentTeam = useSelector(getCurrentTeam)!;

  /**
   * Represents the navigation function from react-router-dom.
   */
  const navigate = useNavigate();

  /**
   * Represents the dark mode.
   */
  const { isDarkMode } = useDarkMode();

  /**
   * Represents the loading state of the table.
   */
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Represents the grid theme based on the dark mode state.
   */
  const gridTheme = isDarkMode ? themeQuartz.withPart(colorSchemeDark) : themeQuartz;

  /**
   * Represents the column definitions for the AgGridReact component.
   */
  const colDefs: (ColDef | ColGroupDef)[] = [
    {
      field: 'name',
      headerName: 'Name',
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: (params: { data: { slug: string; name: string } }) => {
        return params.data && <Link to={`/projects/${params.data.slug}`}>{params.data.name}</Link>;
      },
    },
    {
      headerName: 'Actions',
      sortable: true,
      filter: true,
      cellClass: 'button-holder',
      cellStyle: { display: 'flex', justifyContent: 'center', padding: '1rem' },
      cellRenderer: (params: { data?: { slug: string } }) => {
        return (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button size='1' variant='surface' className='my-2 w-full'>
                Actions
                <DropdownMenu.TriggerIcon />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item onClick={() => navigate(`/projects/${params.data?.slug}/schedules`)}>View Schedules</DropdownMenu.Item>
              {currentTeam && (
                <>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item>Edit</DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item color='red'>Delete</DropdownMenu.Item>
                </>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        );
      },
    },
  ];

  /**
   * This useMemo is used to create a custom data source for the AgGridReact component.
   */
  const dataSource: IDatasource = useMemo(
    () => ({
      rowCount: undefined,

      getRows: async (params: IGetRowsParams) => {
        setLoading(true);
        const queryParams = {
          sort: params.sortModel.map((sort) => `${sort.colId},${sort.sort}`).join(';'),
          filters: JSON.stringify(params.filterModel),
          startRow: params.startRow,
          endRow: params.endRow,
          team: currentTeam?.id,
        };

        const result = await sendRequest(Method.GET, 'projects', queryParams);

        params.successCallback(result.rows, result.count);
        setLoading(false);
      },
    }),
    [currentTeam?.id, refresh]
  );

  return (
    <Flex className='my-4'>
      <div style={{ width: '100%', height: 500 }}>
        <AgGridReact
          theme={gridTheme}
          datasource={dataSource}
          rowModelType='infinite'
          loading={loading}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={20}
          sortingOrder={['desc', 'asc', null]}
          enableCellTextSelection={true}
          ensureDomOrder={true}
          autoSizeStrategy={{ type: 'fitGridWidth', defaultMinWidth: 100 }}
        />
      </div>
    </Flex>
  );
};

export { ProjectsTable };
