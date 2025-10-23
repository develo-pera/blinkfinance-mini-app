
import Image from "next/image";
import { ICompany } from "@/models/Company";

const CompanyCard = ({ company }: { company: ICompany }) => {
  return (
    <div className="mt-5 bg-[var(--bf-light-green)] dark:bg-[var(--bf-dark-purple)] rounded-xl p-4 relative overflow-hidden">
      <div className="relative z-1">
        <div className="flex items-start justify-between gap-5">
          <p className="font-bold">{company.name}</p>
          {
            company.logo ? (
              <Image src={company.logo} alt="company logo" width={50} height={50} className="rounded-sm" />
            ) : (
              <div className="w-[50px] h-[50px] rounded-sm bg-gray-200 flex items-center justify-center">
                <p className="text-md font-bold text-center dark:text-[var(--bf-dark-purple)] text-[var(--bf-light-green)]">{company.name.charAt(0)}</p>
              </div>
            )
          }
        </div>
        <div className="mt-15 text-sm">
          <p>VAT: <span className="opacity-60">{company.taxId}</span></p>
          <p>Reg. No: <span className="opacity-60">{company.registrationNumber}</span></p>
          <p>Address: <span className="opacity-60">{company.address.street}, {company.address.zipCode}, {company.address.city}, {company.address.country}</span></p>
        </div>
      </div>
      <div className="absolute bg-[url('/intaglio-vector.min.svg')] bottom-0 top-0 right-0 left-0 opacity-20" />
    </div>
  );
};

export default CompanyCard;