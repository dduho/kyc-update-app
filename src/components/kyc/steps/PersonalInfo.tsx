"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { KYCFormData, NATIONALITY_OPTIONS } from "@/lib/types";

const schema = z.object({
  lastName: z
    .string()
    .min(2, "Le nom doit comporter au moins 2 caractères.")
    .max(60, "Le nom est trop long."),
  firstName: z
    .string()
    .min(2, "Le prénom doit comporter au moins 2 caractères.")
    .max(80, "Le prénom est trop long."),
  dateOfBirth: z.string().min(1, "La date de naissance est requise."),
  placeOfBirth: z
    .string()
    .min(2, "Le lieu de naissance est requis.")
    .max(80),
  nationality: z.string().min(1, "La nationalité est requise."),
  gender: z.enum(["M", "F"], { message: "Veuillez sélectionner un genre." }),
  profession: z.string().min(2, "La profession est requise.").max(80),
  address: z.string().min(5, "L'adresse est requise.").max(150),
});

type FormValues = z.infer<typeof schema>;

interface PersonalInfoProps {
  data: KYCFormData;
  onUpdate: (data: Partial<KYCFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PersonalInfo({
  data,
  onUpdate,
  onNext,
  onBack,
}: PersonalInfoProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      lastName: data.lastName,
      firstName: data.firstName,
      dateOfBirth: data.dateOfBirth,
      placeOfBirth: data.placeOfBirth,
      nationality: data.nationality || "Togolaise",
      gender: data.gender,
      profession: data.profession,
      address: data.address,
    },
  });

  const onSubmit = (values: FormValues) => {
    onUpdate(values);
    onNext();
  };

  // Max date of birth: 18 years ago
  const maxDOB = new Date();
  maxDOB.setFullYear(maxDOB.getFullYear() - 18);
  const maxDOBStr = maxDOB.toISOString().split("T")[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="text-center mb-6 space-y-2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#FFF3E8] to-[#FFE4CC] flex items-center justify-center mx-auto mb-3 shadow-md shadow-orange-100"
        >
          <svg className="w-8 h-8 text-[#F47920]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Informations personnelles
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Renseignez vos informations telles qu&apos;elles apparaissent sur votre pièce d&apos;identité.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Identity section */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.09)] p-4 space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Identité</p>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nom de famille"
              placeholder="Ex: KOFFI"
              error={errors.lastName?.message}
              required
              {...register("lastName")}
              onChange={(e) => {
                const upper = e.target.value.toUpperCase();
                setValue("lastName", upper, { shouldValidate: true });
              }}
            />
            <Input
              label="Prénoms"
              placeholder="Ex: Komla Ama"
              error={errors.firstName?.message}
              required
              {...register("firstName")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date de naissance"
              type="date"
              max={maxDOBStr}
              error={errors.dateOfBirth?.message}
              required
              {...register("dateOfBirth")}
            />
            <Input
              label="Lieu de naissance"
              placeholder="Ex: Lomé"
              error={errors.placeOfBirth?.message}
              required
              {...register("placeOfBirth")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Nationalité"
              options={NATIONALITY_OPTIONS.map((n) => ({ value: n, label: n }))}
              placeholder="Choisir..."
              error={errors.nationality?.message}
              required
              defaultValue={data.nationality || "Togolaise"}
              {...register("nationality")}
            />
            <Select
              label="Sexe"
              options={[
                { value: "M", label: "Masculin" },
                { value: "F", label: "Féminin" },
              ]}
              placeholder="Choisir..."
              error={errors.gender?.message}
              required
              defaultValue={data.gender}
              {...register("gender")}
            />
          </div>
        </div>

        {/* Contact section */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.09)] p-4 space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Coordonnées</p>
          <Input
            label="Profession"
            placeholder="Ex: Commerçant(e), Employé(e), Étudiant(e)..."
            error={errors.profession?.message}
            required
            {...register("profession")}
          />
          <Input
            label="Adresse de résidence"
            placeholder="Ex: Quartier Bè, Rue 15, Maison 42"
            error={errors.address?.message}
            required
            {...register("address")}
          />
        </div>

        <div className="flex gap-3 pt-1">
          <Button variant="secondary" onClick={onBack} className="flex-1">
            Retour
          </Button>
          <Button type="submit" className="flex-2" style={{ flex: 2 }}>
            Continuer
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
