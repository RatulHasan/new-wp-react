import React, {useMemo, useState} from "@wordpress/element";
import {Loading} from "./Loading";
import {EmptyState} from "./EmptyState";
import {Card} from "./Card";
import {ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon} from "@heroicons/react/24/outline";
import {FormInput} from "./FormInput";
import {filtersType} from "../Store/Store";
import {SelectBox} from "./SelectBox";
import {SelectBoxType} from "../Types/SalaryHeadType";
import {__} from "@wordpress/i18n";
import {UserCapNames} from "../Types/UserType";
import {PermissionDenied} from "./404";
import {userCan} from "../Helpers/User";
import {debounce} from "lodash";
import {applyFilters} from "../Helpers/Hooks";
import {Button} from "./Button";

type SortDirection = "asc" | "desc" | "";

type Column = {
    title: string;
    dataIndex: string;
    render?: (text: string, record: any) => JSX.Element;
    sortable?: boolean;
};

type TableProps = {
    columns: Column[];
    data: any[];
    total: number;
    filters: filtersType;
    permissions: UserCapNames
    isLoading?: boolean;
    totalPage?: number;
    per_page?: string | number;
    currentPage?: number;
    onFilterChange?: (defaultFilterObject: filtersType) => void;
    search?: boolean;
    searchPlaceholder?: string;
};

export const Table = ({columns, data, filters, permissions, total, isLoading = true, totalPage = 1, per_page = 10, currentPage = 1, onFilterChange = () => void 0, search = false, searchPlaceholder = "Search by name..."}: TableProps) => {
    if (!userCan(UserCapNames[permissions])) {
        return (
            <>
                <Card>
                    <PermissionDenied />
                </Card>
            </>
        )
    }
    per_page = parseInt(String(per_page));

    const hasIdColumn = columns.some((column) => column.dataIndex === "#");

    let dataIndex = per_page * (currentPage - 1) + 1;

    if (!hasIdColumn) {
        columns = [
            {
                title: "#",
                dataIndex: "#",
                render: (_, record) => <span>{dataIndex++}</span>,
            },
            ...columns,
        ];
    }

    const [sortColumn, setSortColumn] = useState("");
    const [sortDirection, setSortDirection] = useState<SortDirection>("");

    const [filterObject, setFilterObject] = useState(filters);

    const handleSort = (column: Column) => {
        if (column.sortable) {
            if (sortColumn === column.dataIndex) {
                // Reverse the sort direction if already sorted by the same column
                if (sortDirection === "asc") {
                    setSortDirection("desc");
                } else {
                    setSortDirection("asc");
                }
            } else {
                // Set the new sort column and direction
                setSortColumn(column.dataIndex);
                setSortDirection("asc");
            }

            setFilterObject((prevState) => ({
                ...prevState,
                order_by: column.dataIndex,
                order: sortDirection === "asc" ? "asc" : "desc",
            }));

            onFilterChange({
                ...filterObject,
                order_by: column.dataIndex,
                order: sortDirection === "asc" ? "asc" : "desc",
            });
        }
    };


    // Pagination logic
    const totalPages = totalPage || Math.ceil(data.length / per_page);

    const handlePageChange = (page: number) => {
        setFilterObject((prevState) => ({
            ...prevState,
            page,
        }));

        onFilterChange({
            ...filterObject,
            page,
        });
    };

    const perPageOptions: SelectBoxType[] = [
        {
            id: 10,
            name: "10",
        },
        {
            id: 20,
            name: "20",
        },
        {
            id: 50,
            name: "50",
        },
    ];
    const selectedPerPageOption: SelectBoxType = filterObject.per_page ? perPageOptions.find((option) => option.id === parseInt(String(filterObject.per_page))) || perPageOptions[0] : perPageOptions[0];
    const handlePerPageChange = (value: SelectBoxType) => {
        setFilterObject((prevState) => ({
            ...prevState,
            per_page: String(value.id),
        }));

        onFilterChange({
            ...filterObject,
            per_page: String(value.id),
        });
    }

    const handleSearch = useMemo(() => debounce((e: any) => {
        e.preventDefault();
        if (e.target.value.length > 1 && e.target.value.length < 3) return;
        onFilterChange({
            ...filterObject,
            search: e.target.value,
        });
    }, 1000), []);

    const color = applyFilters('pcm.pagination_button_color', 'gray');
    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <div className="overflow-x-auto">
                    {search && (
                        <div className="mb-4 flex items-center justify-end">
                            <label
                                htmlFor="search"
                                className="sr-only"
                            >
                              {searchPlaceholder}
                            </label>
                            <FormInput
                                type="search"
                                autoComplete="off"
                                id="search"
                                placeholder={searchPlaceholder}
                                value={filterObject.search || ''}
                                onChange={(e) => {
                                    setFilterObject((prevState) => ({
                                        ...prevState,
                                        search: e.target.value,
                                    }));
                                    handleSearch(e)
                                }}
                                name="search"
                                autoFocus={!!filterObject.search}
                            />
                        </div>
                    )}
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    scope="col"
                                    key={column.dataIndex}
                                    className={"py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 " + (column.sortable ? "cursor-pointer" : "")}
                                    onClick={() => handleSort(column)}
                                >
                                    <span className="flex items-center">
                                        {column.title}
                                        {column.sortable && (
                                            <span className="ml-1">
                                            {sortColumn === column.dataIndex ? (
                                                sortDirection === "asc" ? (
                                                    <ArrowDownIcon className="w-4 h-4 text-gray-400" />
                                                ) : (
                                                    <ArrowUpIcon className="w-4 h-4 text-gray-400" />
                                                )
                                            ) : (
                                                <ArrowDownIcon className="w-4 h-4 text-gray-400 opacity-30" />
                                            )}
                                        </span>
                                        )}
                                        </span>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                        {!data.length && !isLoading && (
                            <>
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6"
                                    >
                                        <EmptyState />
                                    </td>
                                </tr>
                            </>
                        )}
                        {data.map((item, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6"
                                    >
                                        {column.render
                                            ? column.render(item[column.dataIndex], item)
                                            : item[column.dataIndex]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <nav className="flex items-center">
                    <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-1 mr-6 text-sm text-white focus:outline-none ` + (currentPage === 1 ? `cursor-not-allowed bg-${color}-500` : "")}
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        {__("Previous", "pcm")}
                    </Button>
                    {/*<span className="px-1 py-1 text-sm font-medium text-gray-900">*/}
                    {/*    Page {currentPage} of {totalPages}*/}
                    {/*</span>*/}
                    {totalPages > 1 && (
                        <>
                        <span className="px-1 py-1 text-sm font-medium text-gray-900">
                        {__("Go to page", 'pcm')}
                        </span>
                        <FormInput
                            type="number"
                            value={currentPage}
                            onChange={(e) => handlePageChange(parseInt(e.target.value))}
                            min={1}
                            max={totalPages}
                            id="page"
                            name="page"
                        />
                        <span className="px-1 py-1 text-sm font-medium text-gray-900">
                            {__("of") + " " + totalPages}
                        </span>
                        <span className="mx-2 text-gray-600">|</span>
                    </>
                    )}
                    <span className="px-1 py-1 text-sm font-medium text-gray-900">
                        {__("Showing") + " " + ((parseInt(String(currentPage)) - 1) * parseInt(String(filterObject.per_page)) + 1) + " " + __("to") + " " + (currentPage * parseInt(String(filterObject.per_page)) > total ? total : currentPage * parseInt(String(filterObject.per_page))) + " " + __("of") + " " + total + " " + __("results")}
                    </span>
                    <span className="mx-2 text-gray-600">|</span>
                    <span className="px-1 py-1 text-sm font-medium text-gray-900">
                        {__("Showing per page", "pcm")}
                    </span>
                    <span className="px-1 py-1 text-sm font-medium text-gray-900">
                        <SelectBox
                            title=""
                            className="w-20 h-10"
                            options={perPageOptions}
                            selected={selectedPerPageOption}
                            setSelected={(value) => handlePerPageChange(value)}
                        />
                    </span>
                    <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === parseInt(String(totalPages))}
                        className={`px-4 py-1 ml-6 text-sm text-white focus:outline-none ` + (currentPage === parseInt(String(totalPages)) ? `cursor-not-allowed bg-${color}-500` : "")}
                    >
                    {__("Next", "pcm")}
                        <ArrowRightIcon className="w-4 h-4" />
                    </Button>
                </nav>
            </div>
        </>
    );
};

// @ts-ignore
window.Table = Table;
