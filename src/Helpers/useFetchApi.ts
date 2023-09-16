import apiFetch, {APIFetchOptions} from '@wordpress/api-fetch';
import {useEffect, useState} from '@wordpress/element';


export const apiFetchUnparsed = async <Model>(path: string, options?: APIFetchOptions, data?: any): Promise<Model> => {
    // Add headers to the options
    if (!options?.headers) {
        options = {
            ...options, headers: {
                'Content-Type': 'application/json',
            }
        };
    }

    if (!options?.parse) {
        options = {...options, parse: false};
    }

    const requestOptions: APIFetchOptions = {path, ...options};
    if (data) {
        requestOptions.body = JSON.stringify(data);
    }

    // @ts-ignore
    return apiFetch(requestOptions).then((response: Response) => {
        let data: any = response;
        if(response.ok){
            data = response.json();
        }
        return Promise.all([data]).then(([jsonData]) => {
            return {data: jsonData};
        });
    }).catch((error) => {
        return {data: error};
    })
};
const useFetchApi = <Model extends object>(url: string, initialFilters?: object, run = true): {
    models: Model[];
    total: number;
    totalPages: number;
    filterObject: object;
    setFilterObject: <FilterType>(newFilterObj: FilterType) => void;
    loading: boolean;
} => {
    const [loading, setLoading] = useState<boolean>(true);
    const [models, setModels] = useState<Model[]>([]);
    const [filterObject, setFilter] = useState<object>(initialFilters || {});
    const [total, setTotal] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const setFilterObject = <FilterType>(newFilterObj: FilterType): void => {
        setFilter((prevFilter) => ({...prevFilter, ...newFilterObj}));
    }

    const makeRequest = async <DataType>(requestUrl: string, requestMethod: string = 'GET', run: boolean = true, requestData?: any): Promise<DataType> => {
        setLoading(true);
        const requestOptions: APIFetchOptions = {method: requestMethod, headers: {'Content-Type': 'application/json'},};

        if (requestData) {
            requestOptions.body = JSON.stringify(requestData);
        }

        return apiFetchUnparsed(requestUrl, requestOptions).then((response: any) => {
            setLoading(false);

            return response.data;
        });
    }


    useEffect(() => {
        if (!run) return;

        setLoading(true);
        const queryParam = new URLSearchParams(filterObject as URLSearchParams).toString();
        const path = url + '?' + queryParam;
        apiFetchUnparsed(path, initialFilters).then((response: any) => {
            if (response.data.status === 200 && response.data) {
                setModels(response.data.data);
                setTotal(response.data.headers['X-WP-Total']);
                setTotalPages(response.data.headers['X-WP-TotalPages']);
            }

            setLoading(false);
        });
    }, [filterObject, run]);

    return {
        models,
        total,
        totalPages,
        loading,
        filterObject,
        setFilterObject,
    }
};

export default useFetchApi;
