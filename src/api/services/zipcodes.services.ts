import { zipCodesApi } from "../zipCodes.api";

export const getZipCodeFn = async (zipCode: string) => {
	console.log(zipCode)
	const { data } = await zipCodesApi.get(zipCode);
	return data;
}