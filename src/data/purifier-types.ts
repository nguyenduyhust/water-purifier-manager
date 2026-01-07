import type { FilterTemplate } from "@/types";

export interface DefaultPurifierType {
  id: string;
  name: { en: string; vi: string };
  filterTemplates: Array<{
    position: number;
    name: { en: string; vi: string };
    defaultIntervalMonths: number;
    description: { en: string; vi: string };
  }>;
}

export interface LocalizedPurifierType {
  id: string;
  name: string;
  filterTemplates: FilterTemplate[];
}

export const DEFAULT_PURIFIER_TYPES: DefaultPurifierType[] = [
  // Kangaroo Models (based on official Kangaroo filter chart)
  {
    id: "kangaroo-kg104",
    name: {
      en: "Kangaroo - KG104 (7 filters)",
      vi: "Kangaroo - KG104 (7 lõi)",
    },
    filterTemplates: [
      {
        position: 1,
        name: { en: "Filter 1 - PP 5µm", vi: "Lõi số 1 - PP 5µm" },
        defaultIntervalMonths: 6,
        description: {
          en: "Removes sediment, rust, particles > 5 micron",
          vi: "Lọc cặn thô, rỉ sét, tạp chất > 5 micron",
        },
      },
      {
        position: 2,
        name: { en: "Filter 2 - Activated Carbon", vi: "Lõi số 2 - Than hoạt tính" },
        defaultIntervalMonths: 6,
        description: {
          en: "Activated carbon, removes odor, chlorine",
          vi: "Than hoạt tính, khử mùi, chlorine",
        },
      },
      {
        position: 3,
        name: { en: "Filter 3 - PP 1µm", vi: "Lõi số 3 - PP 1µm" },
        defaultIntervalMonths: 6,
        description: {
          en: "Fine filter, removes particles > 1 micron",
          vi: "Lọc tinh, loại bỏ tạp chất > 1 micron",
        },
      },
      {
        position: 4,
        name: { en: "Filter 4 - RO Filmtec", vi: "Lõi số 4 - Màng RO Filmtec" },
        defaultIntervalMonths: 24,
        description: {
          en: "RO Filmtec membrane removes 99% of impurities",
          vi: "Màng lọc RO Filmtec loại bỏ 99% tạp chất",
        },
      },
      {
        position: 5,
        name: { en: "Filter 5 - Nano Silver", vi: "Lõi số 5 - Nano Silver" },
        defaultIntervalMonths: 12,
        description: {
          en: "Antibacterial nano silver technology",
          vi: "Diệt khuẩn bằng công nghệ nano bạc",
        },
      },
      {
        position: 6,
        name: { en: "Filter 6 - Ceramic Ball", vi: "Lõi số 6 - Bóng gốm" },
        defaultIntervalMonths: 12,
        description: {
          en: "Ceramic ball filter, adds minerals",
          vi: "Lõi bóng gốm, bổ sung khoáng chất",
        },
      },
      {
        position: 7,
        name: { en: "Filter 7 - Alkaline", vi: "Lõi số 7 - Alkaline" },
        defaultIntervalMonths: 12,
        description: {
          en: "Creates alkaline water, balances pH",
          vi: "Tạo nước kiềm, cân bằng độ pH",
        },
      },
    ],
  },
  {
    id: "kangaroo-kg106",
    name: {
      en: "Kangaroo - KG106 (8 filters)",
      vi: "Kangaroo - KG106 (8 lõi)",
    },
    filterTemplates: [
      {
        position: 1,
        name: { en: "Filter 1 - PP 5µm", vi: "Lõi số 1 - PP 5µm" },
        defaultIntervalMonths: 6,
        description: {
          en: "Removes sediment, rust, particles > 5 micron",
          vi: "Lọc cặn thô, rỉ sét, tạp chất > 5 micron",
        },
      },
      {
        position: 2,
        name: { en: "Filter 2 - Activated Carbon", vi: "Lõi số 2 - Than hoạt tính" },
        defaultIntervalMonths: 6,
        description: {
          en: "Activated carbon, removes odor, chlorine",
          vi: "Than hoạt tính, khử mùi, chlorine",
        },
      },
      {
        position: 3,
        name: { en: "Filter 3 - PP 1µm", vi: "Lõi số 3 - PP 1µm" },
        defaultIntervalMonths: 6,
        description: {
          en: "Fine filter, removes particles > 1 micron",
          vi: "Lọc tinh, loại bỏ tạp chất > 1 micron",
        },
      },
      {
        position: 4,
        name: { en: "Filter 4 - RO Filmtec", vi: "Lõi số 4 - Màng RO Filmtec" },
        defaultIntervalMonths: 24,
        description: {
          en: "RO Filmtec membrane removes 99% of impurities",
          vi: "Màng lọc RO Filmtec loại bỏ 99% tạp chất",
        },
      },
      {
        position: 5,
        name: { en: "Filter 5 - Nano Silver", vi: "Lõi số 5 - Nano Silver" },
        defaultIntervalMonths: 12,
        description: {
          en: "Antibacterial nano silver technology",
          vi: "Diệt khuẩn bằng công nghệ nano bạc",
        },
      },
      {
        position: 6,
        name: { en: "Filter 6 - Ceramic Ball", vi: "Lõi số 6 - Bóng gốm" },
        defaultIntervalMonths: 12,
        description: {
          en: "Ceramic ball filter, adds minerals",
          vi: "Lõi bóng gốm, bổ sung khoáng chất",
        },
      },
      {
        position: 7,
        name: { en: "Filter 7 - Alkaline", vi: "Lõi số 7 - Alkaline" },
        defaultIntervalMonths: 12,
        description: {
          en: "Creates alkaline water, balances pH",
          vi: "Tạo nước kiềm, cân bằng độ pH",
        },
      },
      {
        position: 8,
        name: { en: "Filter 8 - Maifan", vi: "Lõi số 8 - Maifan" },
        defaultIntervalMonths: 12,
        description: {
          en: "Maifan stone, adds beneficial minerals",
          vi: "Đá Maifan, bổ sung khoáng chất có lợi",
        },
      },
    ],
  },
  {
    id: "kangaroo-kg108",
    name: {
      en: "Kangaroo - KG108 (8 filters)",
      vi: "Kangaroo - KG108 (8 lõi)",
    },
    filterTemplates: [
      {
        position: 1,
        name: { en: "Filter 1 - PP 5µm + Quartz", vi: "Lõi số 1 - PP 5µm Cát thạch anh" },
        defaultIntervalMonths: 6,
        description: {
          en: "PP filter with quartz sand, removes sediment",
          vi: "Lõi PP kết hợp cát thạch anh, lọc cặn thô",
        },
      },
      {
        position: 2,
        name: { en: "Filter 2 - Activated Carbon", vi: "Lõi số 2 - Than hoạt tính" },
        defaultIntervalMonths: 6,
        description: {
          en: "Activated carbon, removes odor, chlorine",
          vi: "Than hoạt tính, khử mùi, chlorine",
        },
      },
      {
        position: 3,
        name: { en: "Filter 3 - PP 1µm", vi: "Lõi số 3 - PP 1µm" },
        defaultIntervalMonths: 6,
        description: {
          en: "Fine filter, removes particles > 1 micron",
          vi: "Lọc tinh, loại bỏ tạp chất > 1 micron",
        },
      },
      {
        position: 4,
        name: { en: "Filter 4 - RO Filmtec", vi: "Lõi số 4 - Màng RO Filmtec" },
        defaultIntervalMonths: 24,
        description: {
          en: "RO Filmtec membrane removes 99% of impurities",
          vi: "Màng lọc RO Filmtec loại bỏ 99% tạp chất",
        },
      },
      {
        position: 5,
        name: { en: "Filter 5 - Nano Silver", vi: "Lõi số 5 - Nano Silver" },
        defaultIntervalMonths: 12,
        description: {
          en: "Antibacterial nano silver technology",
          vi: "Diệt khuẩn bằng công nghệ nano bạc",
        },
      },
      {
        position: 6,
        name: { en: "Filter 6 - 3-in-1", vi: "Lõi số 6 - Lõi 3 trong 1" },
        defaultIntervalMonths: 12,
        description: {
          en: "3-in-1 filter: minerals, far infrared, magnetic",
          vi: "Lõi 3 trong 1: khoáng, tia hồng ngoại xa, từ tính",
        },
      },
      {
        position: 7,
        name: { en: "Filter 7 - Alkaline", vi: "Lõi số 7 - Alkaline" },
        defaultIntervalMonths: 12,
        description: {
          en: "Creates alkaline water, balances pH",
          vi: "Tạo nước kiềm, cân bằng độ pH",
        },
      },
      {
        position: 8,
        name: { en: "Filter 8 - Maifan", vi: "Lõi số 8 - Maifan" },
        defaultIntervalMonths: 12,
        description: {
          en: "Maifan stone, adds beneficial minerals",
          vi: "Đá Maifan, bổ sung khoáng chất có lợi",
        },
      },
    ],
  },
  {
    id: "kangaroo-kg116",
    name: {
      en: "Kangaroo - KG116 (9 filters)",
      vi: "Kangaroo - KG116 (9 lõi)",
    },
    filterTemplates: [
      {
        position: 1,
        name: { en: "Filter 1 - PP 5µm", vi: "Lõi số 1 - PP 5µm" },
        defaultIntervalMonths: 6,
        description: {
          en: "Removes sediment, rust, particles > 5 micron",
          vi: "Lọc cặn thô, rỉ sét, tạp chất > 5 micron",
        },
      },
      {
        position: 2,
        name: { en: "Filter 2 - Activated Carbon", vi: "Lõi số 2 - Than hoạt tính" },
        defaultIntervalMonths: 6,
        description: {
          en: "Activated carbon, removes odor, chlorine",
          vi: "Than hoạt tính, khử mùi, chlorine",
        },
      },
      {
        position: 3,
        name: { en: "Filter 3 - PP 1µm", vi: "Lõi số 3 - PP 1µm" },
        defaultIntervalMonths: 6,
        description: {
          en: "Fine filter, removes particles > 1 micron",
          vi: "Lọc tinh, loại bỏ tạp chất > 1 micron",
        },
      },
      {
        position: 4,
        name: { en: "Filter 4 - RO Filmtec", vi: "Lõi số 4 - Màng RO Filmtec" },
        defaultIntervalMonths: 24,
        description: {
          en: "RO Filmtec membrane removes 99% of impurities",
          vi: "Màng lọc RO Filmtec loại bỏ 99% tạp chất",
        },
      },
      {
        position: 5,
        name: { en: "Filter 5 - Nano Silver", vi: "Lõi số 5 - Nano Silver" },
        defaultIntervalMonths: 12,
        description: {
          en: "Antibacterial nano silver technology",
          vi: "Diệt khuẩn bằng công nghệ nano bạc",
        },
      },
      {
        position: 6,
        name: { en: "Filter 6 - Ceramic Ball", vi: "Lõi số 6 - Bóng gốm" },
        defaultIntervalMonths: 12,
        description: {
          en: "Ceramic ball filter, adds minerals",
          vi: "Lõi bóng gốm, bổ sung khoáng chất",
        },
      },
      {
        position: 7,
        name: { en: "Filter 7 - Alkaline", vi: "Lõi số 7 - Alkaline" },
        defaultIntervalMonths: 12,
        description: {
          en: "Creates alkaline water, balances pH",
          vi: "Tạo nước kiềm, cân bằng độ pH",
        },
      },
      {
        position: 8,
        name: { en: "Filter 8 - Maifan", vi: "Lõi số 8 - Maifan" },
        defaultIntervalMonths: 12,
        description: {
          en: "Maifan stone, adds beneficial minerals",
          vi: "Đá Maifan, bổ sung khoáng chất có lợi",
        },
      },
      {
        position: 9,
        name: { en: "Filter 9 - ORP", vi: "Lõi số 9 - ORP" },
        defaultIntervalMonths: 12,
        description: {
          en: "ORP filter, creates antioxidant water",
          vi: "Lõi ORP, tạo nước chống oxy hóa",
        },
      },
    ],
  },
  {
    id: "kangaroo-kg109",
    name: {
      en: "Kangaroo - KG109 (9 filters)",
      vi: "Kangaroo - KG109 (9 lõi)",
    },
    filterTemplates: [
      {
        position: 1,
        name: { en: "Filter 1 - PP 5µm + Quartz", vi: "Lõi số 1 - PP 5µm Cát thạch anh" },
        defaultIntervalMonths: 6,
        description: {
          en: "PP filter with quartz sand, removes sediment",
          vi: "Lõi PP kết hợp cát thạch anh, lọc cặn thô",
        },
      },
      {
        position: 2,
        name: { en: "Filter 2 - Activated Carbon", vi: "Lõi số 2 - Than hoạt tính" },
        defaultIntervalMonths: 6,
        description: {
          en: "Activated carbon, removes odor, chlorine",
          vi: "Than hoạt tính, khử mùi, chlorine",
        },
      },
      {
        position: 3,
        name: { en: "Filter 3 - PP 1µm", vi: "Lõi số 3 - PP 1µm" },
        defaultIntervalMonths: 6,
        description: {
          en: "Fine filter, removes particles > 1 micron",
          vi: "Lọc tinh, loại bỏ tạp chất > 1 micron",
        },
      },
      {
        position: 4,
        name: { en: "Filter 4 - RO Filmtec", vi: "Lõi số 4 - Màng RO Filmtec" },
        defaultIntervalMonths: 24,
        description: {
          en: "RO Filmtec membrane removes 99% of impurities",
          vi: "Màng lọc RO Filmtec loại bỏ 99% tạp chất",
        },
      },
      {
        position: 5,
        name: { en: "Filter 5 - Nano Silver", vi: "Lõi số 5 - Nano Silver" },
        defaultIntervalMonths: 12,
        description: {
          en: "Antibacterial nano silver technology",
          vi: "Diệt khuẩn bằng công nghệ nano bạc",
        },
      },
      {
        position: 6,
        name: { en: "Filter 6 - 3-in-1", vi: "Lõi số 6 - Lõi 3 trong 1" },
        defaultIntervalMonths: 12,
        description: {
          en: "3-in-1 filter: minerals, far infrared, magnetic",
          vi: "Lõi 3 trong 1: khoáng, tia hồng ngoại xa, từ tính",
        },
      },
      {
        position: 7,
        name: { en: "Filter 7 - Alkaline", vi: "Lõi số 7 - Alkaline" },
        defaultIntervalMonths: 12,
        description: {
          en: "Creates alkaline water, balances pH",
          vi: "Tạo nước kiềm, cân bằng độ pH",
        },
      },
      {
        position: 8,
        name: { en: "Filter 8 - Maifan", vi: "Lõi số 8 - Maifan" },
        defaultIntervalMonths: 12,
        description: {
          en: "Maifan stone, adds beneficial minerals",
          vi: "Đá Maifan, bổ sung khoáng chất có lợi",
        },
      },
      {
        position: 9,
        name: { en: "Filter 9 - ORP", vi: "Lõi số 9 - ORP" },
        defaultIntervalMonths: 12,
        description: {
          en: "ORP filter, creates antioxidant water",
          vi: "Lõi ORP, tạo nước chống oxy hóa",
        },
      },
    ],
  },

  // Karofi Models
  {
    id: "karofi-ksi80",
    name: {
      en: "Karofi - KSI80 (8 filters)",
      vi: "Karofi - KSI80 (8 lõi)",
    },
    filterTemplates: [
      {
        position: 1,
        name: { en: "Filter 1 - PP", vi: "Lõi số 1 - PP" },
        defaultIntervalMonths: 3,
        description: {
          en: "Removes sediment, rust, particles > 5 micron",
          vi: "Lọc cặn thô, rỉ sét, tạp chất > 5 micron",
        },
      },
      {
        position: 2,
        name: { en: "Filter 2 - GAC", vi: "Lõi số 2 - GAC" },
        defaultIntervalMonths: 6,
        description: {
          en: "Granular activated carbon, removes odor, chlorine",
          vi: "Than hoạt tính dạng hạt, khử mùi, chlorine",
        },
      },
      {
        position: 3,
        name: { en: "Filter 3 - CTO", vi: "Lõi số 3 - CTO" },
        defaultIntervalMonths: 6,
        description: {
          en: "Carbon block, removes chemicals",
          vi: "Than hoạt tính dạng khối, lọc hóa chất",
        },
      },
      {
        position: 4,
        name: { en: "Filter 4 - RO Membrane", vi: "Lõi số 4 - Màng RO" },
        defaultIntervalMonths: 24,
        description: {
          en: "Smax RO membrane removes 99% of impurities",
          vi: "Màng lọc RO Smax loại bỏ 99% tạp chất",
        },
      },
      {
        position: 5,
        name: { en: "Filter 5 - TCR", vi: "Lõi số 5 - TCR" },
        defaultIntervalMonths: 12,
        description: {
          en: "Premium activated carbon, improves taste",
          vi: "Than hoạt tính cao cấp, cải thiện vị nước",
        },
      },
      {
        position: 6,
        name: { en: "Filter 6 - Hydrogen", vi: "Lõi số 6 - Hydrogen" },
        defaultIntervalMonths: 12,
        description: {
          en: "Creates hydrogen-rich water, antioxidant",
          vi: "Tạo nước giàu hydrogen, chống oxy hóa",
        },
      },
      {
        position: 7,
        name: { en: "Filter 7 - Mineral", vi: "Lõi số 7 - Khoáng" },
        defaultIntervalMonths: 12,
        description: {
          en: "Adds natural minerals",
          vi: "Bổ sung khoáng chất thiên nhiên",
        },
      },
      {
        position: 8,
        name: { en: "Filter 8 - Nano Silver", vi: "Lõi số 8 - Nano Silver" },
        defaultIntervalMonths: 12,
        description: {
          en: "Antibacterial nano silver technology",
          vi: "Diệt khuẩn bằng công nghệ nano bạc",
        },
      },
    ],
  },
  {
    id: "karofi-optimus-o-i229",
    name: {
      en: "Karofi - Optimus O-i229 (9 filters)",
      vi: "Karofi - Optimus O-i229 (9 lõi)",
    },
    filterTemplates: [
      {
        position: 1,
        name: { en: "Filter 1 - Sediment", vi: "Lõi số 1 - Sediment" },
        defaultIntervalMonths: 6,
        description: {
          en: "Removes sediment, rust, particles > 5 micron",
          vi: "Lọc cặn thô, rỉ sét, tạp chất > 5 micron",
        },
      },
      {
        position: 2,
        name: { en: "Filter 2 - Pre-Carbon", vi: "Lõi số 2 - Pre-Carbon" },
        defaultIntervalMonths: 6,
        description: {
          en: "Pre-RO carbon, protects membrane",
          vi: "Than hoạt tính trước RO, bảo vệ màng",
        },
      },
      {
        position: 3,
        name: { en: "Filter 3 - RO Smax Membrane", vi: "Lõi số 3 - Màng RO Smax" },
        defaultIntervalMonths: 30,
        description: {
          en: "Smax RO technology, long lifespan",
          vi: "Màng RO công nghệ Smax, tuổi thọ cao",
        },
      },
      {
        position: 4,
        name: { en: "Filter 4 - Post-Carbon", vi: "Lõi số 4 - Post-Carbon" },
        defaultIntervalMonths: 12,
        description: {
          en: "Post-RO carbon, improves taste",
          vi: "Than hoạt tính sau RO, cải thiện vị nước",
        },
      },
      {
        position: 5,
        name: { en: "Filter 5 - ORP", vi: "Lõi số 5 - ORP" },
        defaultIntervalMonths: 12,
        description: {
          en: "Increases ORP, energy-rich water",
          vi: "Tăng chỉ số ORP, nước giàu năng lượng",
        },
      },
      {
        position: 6,
        name: { en: "Filter 6 - Hydrogen", vi: "Lõi số 6 - Hydrogen" },
        defaultIntervalMonths: 12,
        description: {
          en: "Creates hydrogen-rich water, antioxidant",
          vi: "Tạo nước giàu hydrogen, chống oxy hóa",
        },
      },
      {
        position: 7,
        name: { en: "Filter 7 - Mineral", vi: "Lõi số 7 - Khoáng" },
        defaultIntervalMonths: 12,
        description: {
          en: "Adds natural minerals",
          vi: "Bổ sung khoáng chất thiên nhiên",
        },
      },
      {
        position: 8,
        name: { en: "Filter 8 - Alkaline", vi: "Lõi số 8 - Alkaline" },
        defaultIntervalMonths: 12,
        description: {
          en: "Creates alkaline water, balances pH",
          vi: "Tạo nước kiềm, cân bằng độ pH",
        },
      },
      {
        position: 9,
        name: { en: "Filter 9 - Nano Silver", vi: "Lõi số 9 - Nano Silver" },
        defaultIntervalMonths: 12,
        description: {
          en: "Antibacterial nano silver technology",
          vi: "Diệt khuẩn bằng công nghệ nano bạc",
        },
      },
    ],
  },
  {
    id: "karofi-kad-x60",
    name: {
      en: "Karofi - KAD-X60 (10 filters)",
      vi: "Karofi - KAD-X60 (10 lõi)",
    },
    filterTemplates: [
      {
        position: 1,
        name: { en: "Filter 1 - PP 5 micron", vi: "Lõi số 1 - PP 5 micron" },
        defaultIntervalMonths: 3,
        description: {
          en: "Removes sediment, rust, particles > 5 micron",
          vi: "Lọc cặn thô, rỉ sét, tạp chất > 5 micron",
        },
      },
      {
        position: 2,
        name: { en: "Filter 2 - PP 1 micron", vi: "Lõi số 2 - PP 1 micron" },
        defaultIntervalMonths: 6,
        description: {
          en: "Removes fine particles > 1 micron",
          vi: "Lọc cặn mịn > 1 micron",
        },
      },
      {
        position: 3,
        name: { en: "Filter 3 - GAC", vi: "Lõi số 3 - GAC" },
        defaultIntervalMonths: 6,
        description: {
          en: "Granular activated carbon, removes odor, chlorine",
          vi: "Than hoạt tính dạng hạt, khử mùi, chlorine",
        },
      },
      {
        position: 4,
        name: { en: "Filter 4 - CTO", vi: "Lõi số 4 - CTO" },
        defaultIntervalMonths: 6,
        description: {
          en: "Carbon block, removes chemicals",
          vi: "Than hoạt tính dạng khối, lọc hóa chất",
        },
      },
      {
        position: 5,
        name: { en: "Filter 5 - RO Membrane", vi: "Lõi số 5 - Màng RO" },
        defaultIntervalMonths: 24,
        description: {
          en: "RO membrane removes 99% of impurities",
          vi: "Màng lọc RO loại bỏ 99% tạp chất",
        },
      },
      {
        position: 6,
        name: { en: "Filter 6 - T33", vi: "Lõi số 6 - T33" },
        defaultIntervalMonths: 12,
        description: {
          en: "Post-RO carbon, improves taste",
          vi: "Than hoạt tính sau RO, cải thiện vị nước",
        },
      },
      {
        position: 7,
        name: { en: "Filter 7 - Mineral", vi: "Lõi số 7 - Khoáng" },
        defaultIntervalMonths: 12,
        description: {
          en: "Adds natural minerals",
          vi: "Bổ sung khoáng chất thiên nhiên",
        },
      },
      {
        position: 8,
        name: { en: "Filter 8 - Nano Silver", vi: "Lõi số 8 - Nano Silver" },
        defaultIntervalMonths: 12,
        description: {
          en: "Antibacterial nano silver technology",
          vi: "Diệt khuẩn bằng công nghệ nano bạc",
        },
      },
      {
        position: 9,
        name: { en: "Filter 9 - Alkaline", vi: "Lõi số 9 - Alkaline" },
        defaultIntervalMonths: 12,
        description: {
          en: "Creates alkaline water, balances pH",
          vi: "Tạo nước kiềm, cân bằng độ pH",
        },
      },
      {
        position: 10,
        name: { en: "Filter 10 - Hydrogen", vi: "Lõi số 10 - Hydrogen" },
        defaultIntervalMonths: 18,
        description: {
          en: "Creates hydrogen-rich water, antioxidant",
          vi: "Tạo nước giàu hydrogen, chống oxy hóa",
        },
      },
    ],
  },

  // Sunhouse
  {
    id: "sunhouse-shr76210ck",
    name: {
      en: "Sunhouse - SHR76210CK (10 filters)",
      vi: "Sunhouse - SHR76210CK (10 lõi)",
    },
    filterTemplates: [
      {
        position: 1,
        name: { en: "Filter 1 - PP", vi: "Lõi số 1 - PP" },
        defaultIntervalMonths: 3,
        description: {
          en: "Removes sediment, rust > 5 micron",
          vi: "Lọc cặn thô, rỉ sét > 5 micron",
        },
      },
      {
        position: 2,
        name: { en: "Filter 2 - UDF", vi: "Lõi số 2 - UDF" },
        defaultIntervalMonths: 6,
        description: {
          en: "Granular activated carbon",
          vi: "Than hoạt tính dạng hạt",
        },
      },
      {
        position: 3,
        name: { en: "Filter 3 - CTO", vi: "Lõi số 3 - CTO" },
        defaultIntervalMonths: 6,
        description: {
          en: "Carbon block",
          vi: "Than hoạt tính dạng khối",
        },
      },
      {
        position: 4,
        name: { en: "Filter 4 - RO Membrane", vi: "Lõi số 4 - Màng RO" },
        defaultIntervalMonths: 24,
        description: {
          en: "RO membrane removes 99% of impurities",
          vi: "Màng lọc RO loại bỏ 99% tạp chất",
        },
      },
      {
        position: 5,
        name: { en: "Filter 5 - T33", vi: "Lõi số 5 - T33" },
        defaultIntervalMonths: 12,
        description: {
          en: "Post-RO carbon",
          vi: "Than hoạt tính sau RO",
        },
      },
      {
        position: 6,
        name: { en: "Filter 6 - Mineral", vi: "Lõi số 6 - Khoáng" },
        defaultIntervalMonths: 12,
        description: {
          en: "Adds minerals",
          vi: "Bổ sung khoáng chất",
        },
      },
      {
        position: 7,
        name: { en: "Filter 7 - Nano Silver", vi: "Lõi số 7 - Nano Silver" },
        defaultIntervalMonths: 12,
        description: {
          en: "Nano silver antibacterial",
          vi: "Diệt khuẩn nano bạc",
        },
      },
      {
        position: 8,
        name: { en: "Filter 8 - Alkaline", vi: "Lõi số 8 - Alkaline" },
        defaultIntervalMonths: 12,
        description: {
          en: "Creates alkaline water",
          vi: "Tạo nước kiềm",
        },
      },
      {
        position: 9,
        name: { en: "Filter 9 - Hydrogen", vi: "Lõi số 9 - Hydrogen" },
        defaultIntervalMonths: 18,
        description: {
          en: "Creates hydrogen-rich water",
          vi: "Tạo nước giàu hydrogen",
        },
      },
      {
        position: 10,
        name: { en: "Filter 10 - Far Infrared", vi: "Lõi số 10 - Far Infrared" },
        defaultIntervalMonths: 18,
        description: {
          en: "Far infrared rays",
          vi: "Tia hồng ngoại xa",
        },
      },
    ],
  },
];

type Language = "en" | "vi";

export function getLocalizedPurifierTypes(lang: Language): LocalizedPurifierType[] {
  return DEFAULT_PURIFIER_TYPES.map((type) => ({
    id: type.id,
    name: type.name[lang],
    filterTemplates: type.filterTemplates.map((filter) => ({
      position: filter.position,
      name: filter.name[lang],
      defaultIntervalMonths: filter.defaultIntervalMonths,
      description: filter.description[lang],
    })),
  }));
}

export function getLocalizedPurifierTypeById(
  id: string,
  lang: Language
): LocalizedPurifierType | undefined {
  const type = DEFAULT_PURIFIER_TYPES.find((t) => t.id === id);
  if (!type) return undefined;

  return {
    id: type.id,
    name: type.name[lang],
    filterTemplates: type.filterTemplates.map((filter) => ({
      position: filter.position,
      name: filter.name[lang],
      defaultIntervalMonths: filter.defaultIntervalMonths,
      description: filter.description[lang],
    })),
  };
}
