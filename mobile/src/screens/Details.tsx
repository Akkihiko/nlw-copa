import { useEffect, useState } from "react";
import { HStack, useToast, VStack } from "native-base";
import { useRoute } from '@react-navigation/native'
import { Share } from "react-native";

import { api } from "../services/api";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PoolCardProps } from '../components/PoolCard';
import { PoolHeader } from "../components/PoolHeader";
import { Guesses } from "../components/Guesses";
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Option } from "../components/Option";

interface RouteParams {
  id: string;
}

export function Details() {
  const [isLoading, setIsLoading] = useState(true);
  const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses');
  const [pollDetails, setPollDetails] = useState<PoolCardProps>({} as PoolCardProps);

  const route = useRoute();
  const toast = useToast();

  const { id } = route.params as RouteParams;

  async function fetchPollDetails() {
    try {
      setIsLoading(true);

      const response = await api.get(`/polls/${id}`);

      setPollDetails(response.data.polls);
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Não foi possível carregar os detalhes do bolão!",
        placement: "top",
        bgColor: "red.500"
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: 'Entre no meu bolão da NLW Copa! O código do meu bolão é: ' + pollDetails.code,
    });
  }

  useEffect(() => {
    fetchPollDetails();
  }, [id]);

  if (isLoading) {
    return (
      <Loading />
    );
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header 
        title={pollDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />

      {
        pollDetails._count.participants > 0 ?
        
        <VStack px={5} flex={1}>
          <PoolHeader data={pollDetails} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={optionSelected === 'guesses'}
              onPress={() => setOptionSelected('guesses')}
            />

            <Option
              title="Ranking do grupo"
              isSelected={optionSelected === 'ranking'}
              onPress={() => setOptionSelected('ranking')}
            />
          </HStack>

          <Guesses 
            poolId={pollDetails.id} 
            code={pollDetails.code}
          />
        </VStack> :

        <EmptyMyPoolList code={pollDetails.code} />
      }

    </VStack>
  )
}