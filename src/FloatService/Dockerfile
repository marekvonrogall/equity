
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

COPY FloatService.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /out .

EXPOSE 5001

ENTRYPOINT ["dotnet", "FloatService.dll"]