export interface FamilyMember {
  reasonOfDeath: string | null; // Changed from `any` to `string | null`
  placeOfBurial: string;
  id: string;
  name: string;
  birthDate: string;
  deathDate?: string;
  generationNo: number;
  image: string;
  parentId: string;
  spouseId: string;
  siblings: string[];
  children: string[];
  gender: "male" | "female" | "other";
  occupation: string;
  education: string;
  notes: string;
}
