import { Layout } from "@/components/Layout";
import { FriendsList } from "@/components/FriendsList";
/* import { useLanguage } from "@/contexts/LanguageContext"; */

export const Network = () => {
  /*   const { t } = useLanguage(); */

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* <h1 className="text-2xl font-bold animate-fade-in">{t("page.network")}</h1> */}

        {/* </div><div className="grid gap-6 md:grid-cols-2"> */}
        <div className="flex flex-col gap-6">
          <FriendsList />
        </div>
      </div>
    </Layout>
  );
};
