import { Flex } from '@radix-ui/themes';
import { ColDef, ColGroupDef, colorSchemeDark, IDatasource, IGetRowsParams, themeQuartz } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Method, sendRequest } from '../../../clients/api';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { getEnums } from '../../../state/selectors/enums';
import { getCurrentTeam } from '../../../state/selectors/teams';
import { Link } from '../link';

const TargetsTable = ({ refresh }: { refresh: number }): JSX.Element => {
  /**
   * Represents the current team.
   */
  const currentTeam = useSelector(getCurrentTeam)!;
  const enums = useSelector(getEnums);

  /**
   * Represents the dark mode.
   */
  const { isDarkMode } = useDarkMode();

  const [loading, setLoading] = useState<boolean>(false);

  const colDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: 'Name',
      field: 'name',
      flex: 1,
      sortable: true,
      filter: true,
      valueGetter: (params) => params.data,
      cellRenderer: (params: { value: { url: string; slug: string; name: string } }) =>
        params.value && <Link to={`/targets/${params.value.slug}`}>{params.value.name}</Link>,
    },
    {
      headerName: 'Stage',
      field: 'stage',
      sortable: true,
      filter: true,
      cellRenderer: (params: { value: number }) => {
        return enums.stage && enums.stage[params.value];
      },
    },
    {
      headerName: 'Provider',
      field: 'provider',
      sortable: true,
      filter: true,
      cellRenderer: (params: { value: number }) => {
        return enums.pulseProvider && enums.pulseProvider[params?.value];
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

        const result = await sendRequest(Method.GET, 'targets', queryParams);

        params.successCallback(result.rows, result.count);
        setLoading(false);
      },
    }),
    [currentTeam?.id, refresh]
  );

  /**
   * Represents the grid theme based on the dark mode state.
   */
  const gridTheme = isDarkMode ? themeQuartz.withPart(colorSchemeDark) : themeQuartz;

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

export { TargetsTable };
